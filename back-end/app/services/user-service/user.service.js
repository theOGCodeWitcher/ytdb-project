const models = require("../../models");
const { logger } = require("../../config").loggerConfig;
const { google } = require("googleapis");
const channelModel = models.channelModel;
const Cache = models.cacheModel;
const process = require("process");
const userService = require("../user-service/user.service");
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

exports.getAllChannels = async () => {
  await userService.calculateAndUpdateRatings();
  return channelModel.find().exec();
};

exports.updateChannelsData = async () => {
  try {
    const channels = await channelModel.find().exec();
    let count = 1;
    for (const channel of channels) {
      const channelId = channel.ChannelId;

      if (!channelId) {
        console.log(
          `ChannelId missing for document ${channel._id}. Skipping...`
        );
        continue;
      }

      const response = await youtube.channels.list({
        part: "snippet,statistics,brandingSettings,topicDetails",
        id: channelId,
      });
      console.log("Trying to update:", channelId);
      const youtubeData = response.data.items[0];

      channel.Title = youtubeData.snippet.title;
      channel.Description = youtubeData.snippet.description;
      const thumbnails = [];

      for (const thumbnailType in youtubeData.snippet.thumbnails) {
        thumbnails.push(youtubeData.snippet.thumbnails[thumbnailType].url);
      }

      channel.Thumbnails = thumbnails;

      channel.PublishedAt = new Date(youtubeData.snippet.publishedAt);
      if (youtubeData.topicDetails !== undefined) {
        channel.TopicCategories = youtubeData.topicDetails.topicCategories;
      }

      channel.Username = youtubeData.snippet.customUrl || null;
      channel.uploads = parseInt(youtubeData.statistics.videoCount, 10) || 0;
      channel.Subs = parseInt(youtubeData.statistics.subscriberCount, 10) || 0;
      channel.VideoViews = parseInt(youtubeData.statistics.viewCount, 10) || 0;
      if (youtubeData.brandingSettings.image !== undefined) {
        channel.BannerImage =
          youtubeData.brandingSettings.image.bannerExternalUrl;
      }

      await channel.save();
      console.log("Channel data updated successfully for", channelId, count++);
    }

    console.log("Channels data updated successfully.");
    await userService.calculateAndUpdateRatings();
  } catch (error) {
    console.error("Error updating channels data:", error);
  }
};

exports.calculateAndUpdateRatings = async () => {
  try {
    const channels = await channelModel.find().exec();

    const maxMetrics = await channelModel
      .findOne()
      .sort({
        $max: {
          subsAge: "$Subs" / { $divide: [new Date(), "$PublishedAt"] },
          viewsVideos: "$VideoViews" / "$uploads",
          viewsAge: "$VideoViews" / { $divide: [new Date(), "$PublishedAt"] },
          subsVideos: "$Subs" / "$uploads",
        },
      })
      .exec();

    for (const channel of channels) {
      const subsAgeMetric =
        channel.Subs / calculateAgeInDays(channel.PublishedAt, new Date());
      const viewsVideosMetric = channel.VideoViews / channel.uploads;
      const viewsAgeMetric =
        channel.VideoViews /
        calculateAgeInDays(channel.PublishedAt, new Date());
      const subsVideosMetric = channel.Subs / channel.uploads;

      const normalizedSubsAge = subsAgeMetric / maxMetrics.subsAge;
      const normalizedViewsVideos = viewsVideosMetric / maxMetrics.viewsVideos;
      const normalizedViewsAge = viewsAgeMetric / maxMetrics.viewsAge;
      const normalizedSubsVideos = subsVideosMetric / maxMetrics.subsVideos;

      const overallRating = calculateOverallRating(
        normalizedSubsAge,
        normalizedViewsVideos,
        normalizedViewsAge,
        normalizedSubsVideos
      );

      channel.Rating = parseFloat(overallRating.toFixed(1));
      await channel.save();
    }

    console.log("Ratings updated successfully.");
  } catch (error) {
    console.error("Error updating ratings:", error);
  }
};

function calculateOverallRating(subsAge, viewsVideos, viewsAge, subsVideos) {
  const overallRating =
    ((subsAge + viewsVideos + viewsAge + subsVideos) / 4) * 5;
  return Math.min(5, overallRating); // Cap the rating at 5
}

function calculateAgeInDays(publishedAt, currentDate) {
  const ageInMilliseconds = currentDate - publishedAt;
  return ageInMilliseconds / (1000 * 60 * 60 * 24); // Convert to days
}

exports.search = async (query) => {
  try {
    const response = await youtube.search.list({
      part: "snippet",
      q: query,
      maxResults: 10,
      type: "channel",
    });

    const channelResults = response.data.items;

    const channels = channelResults.map((result) => {
      const channelId = result.id.channelId;
      const title = result.snippet.title;
      const thumbnail = result.snippet.thumbnails.default.url;
      const channelURL = `https://www.youtube.com/channel/${channelId}`;

      return {
        id: channelId,
        title: title,
        url: channelURL,
        thumbnail: thumbnail,
      };
    });

    return channels;
  } catch (error) {
    console.error("Error performing YouTube channel search:", error);
  }
};

exports.getChannelDetailsAndInsertOrUpdate = async (channelId) => {
  try {
    const response = await youtube.channels.list({
      part: "snippet,statistics,brandingSettings,topicDetails",
      id: channelId,
    });

    const youtubeData = response.data.items[0];

    if (!youtubeData) {
      console.log(`Channel with ID ${channelId} not found.`);
      return;
    }

    const existingChannel = await channelModel
      .findOne({
        ChannelId: channelId,
      })
      .exec();

    if (existingChannel) {
      existingChannel.uploads = youtubeData.statistics.videoCount;
      existingChannel.Subs = youtubeData.statistics.subscriberCount;
      existingChannel.VideoViews = youtubeData.statistics.viewCount;
      if (youtubeData.brandingSettings.image !== undefined) {
        existingChannel.BannerImage =
          youtubeData.brandingSettings.image.bannerExternalUrl;
      }

      await existingChannel.save();
      console.log(`Channel data updated for ${channelId}`);
      await userService.calculateAndUpdateRatings();
      return existingChannel;
    } else {
      const newChannel = new channelModel({
        ChannelId: channelId,
        Title: youtubeData.snippet.title,
        Description: youtubeData.snippet.description,
        Thumbnails: [],
        PublishedAt: new Date(youtubeData.snippet.publishedAt),
        TopicCategories: [],
        Username: youtubeData.snippet.customUrl || null,
        uploads: parseInt(youtubeData.statistics.videoCount, 10),
        Subs: parseInt(youtubeData.statistics.subscriberCount, 10),
        VideoViews: parseInt(youtubeData.statistics.viewCount, 10),
      });
      if (youtubeData.brandingSettings.image !== undefined) {
        newChannel.BannerImage =
          youtubeData.brandingSettings.image.bannerExternalUrl;
      }
      for (const thumbnailType in youtubeData.snippet.thumbnails) {
        newChannel.Thumbnails.push(
          youtubeData.snippet.thumbnails[thumbnailType].url
        );
      }

      if (youtubeData.topicDetails !== undefined) {
        for (const tType in youtubeData.topicDetails.topicCategories) {
          newChannel.TopicCategories.push(
            youtubeData.topicDetails.topicCategories[tType]
          );
        }
      }
      await channelModel.create(newChannel);
      console.log(`New channel inserted for ${channelId}`);
      await userService.calculateAndUpdateRatings();
      return newChannel;
    }
  } catch (error) {
    console.error(
      `Error updating/inserting channel data for ${channelId}: ${error}`
    );
  }
};
exports.searchByCriteria = async (key, value) => {
  try {
    const channels = await channelModel.find().exec();
    const filteredChannels = channels.filter((channel) => {
      if (Array.isArray(channel[key])) {
        return channel[key].some((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        );
      } else if (typeof channel[key] === "string") {
        return channel[key].toLowerCase().includes(value.toLowerCase());
      }
      return false;
    });

    const top10Channels = filteredChannels.slice(0, 10);

    return top10Channels;
  } catch (error) {
    console.error("Error in searchByCriteria:", error);
  }
};

exports.getRandomChannels = async () => {
  const currentTime = Date.now();
  const apiCallName = "trendingChannels"; // A name to identify this cache

  const cacheEntry = await Cache.findOne({ apiCall: apiCallName });

  if (
    cacheEntry &&
    currentTime - cacheEntry.lastCallTimestamp < 24 * 60 * 60 * 1000
  ) {
    return cacheEntry.cachedRandomChannels;
  }

  const channelCount = await channelModel.countDocuments({
    Rating: { $gt: 0 },
  });

  if (channelCount < 10) {
    throw new Error("Not enough channels with a rating > 3 in the collection.");
  }

  const randomIndices = [];
  while (randomIndices.length < 10) {
    const randomIndex = Math.floor(Math.random() * channelCount);
    if (!randomIndices.includes(randomIndex)) {
      randomIndices.push(randomIndex);
    }
  }

  const randomChannels = await channelModel
    .find({ Rating: { $gt: 0 } })
    .limit(10)
    .skip(randomIndices[0])
    .exec();

  if (cacheEntry) {
    cacheEntry.lastCallTimestamp = currentTime;
    cacheEntry.cachedRandomChannels = randomChannels;
    await cacheEntry.save();
  } else {
    await Cache.create({
      apiCall: apiCallName,
      lastCallTimestamp: currentTime,
      cachedRandomChannels: randomChannels,
    });
  }

  return randomChannels;
};

exports.tryToUpdateChannelsData = async () => {
  const currentTime = Date.now();
  const apiCallName = "updateChannelsData";

  const cacheEntry = await Cache.findOne({ apiCall: apiCallName });

  if (
    !cacheEntry ||
    currentTime - cacheEntry.lastCallTimestamp >= 24 * 60 * 60 * 1000
  ) {
    await userService.updateChannelsData();
    if (cacheEntry) {
      cacheEntry.lastCallTimestamp = currentTime;
      await cacheEntry.save();
    } else {
      await Cache.create({
        apiCall: apiCallName,
        lastCallTimestamp: currentTime,
      });
    }
  }
};
