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

    const totalSubscribers = 252000000;
    const totalAgeInDays = 6437;
    const totalViews = 236294326678;
    const totalVideos = 19727;

    for (const channel of channels) {
      const subscribersWeight = 0.3; // Weight for subscribers
      const ageWeight = 0.2; // Weight for channel age
      const viewsWeight = 0.4; // Weight for video views
      const videosWeight = 0.1; // Weight for number of videos

      const subscribersRating = (channel.Subs / totalSubscribers) * 5;
      const ageInDays = calculateAgeInDays(channel.PublishedAt, new Date());
      const ageRating =
        totalAgeInDays === 0 ? 0 : (ageInDays / totalAgeInDays) * 5;
      const viewsRating = (channel.VideoViews / totalViews) * 5;
      const videosRating =
        totalVideos === 0 ? 0 : (channel.uploads / totalVideos) * 5;

      const overallRating = calculateWeightedRating(
        subscribersRating,
        ageRating,
        viewsRating,
        videosRating,
        subscribersWeight,
        ageWeight,
        viewsWeight,
        videosWeight
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
function calculateWeightedRating(
  subscribersRating,
  ageRating,
  viewsRating,
  videosRating,
  subscribersWeight,
  ageWeight,
  viewsWeight,
  videosWeight
) {
  const weightedSum =
    subscribersRating * subscribersWeight +
    ageRating * ageWeight +
    viewsRating * viewsWeight +
    videosRating * videosWeight;
  const overallRating = weightedSum * 5;
  return Math.min(5, overallRating); // Cap the rating at 5
}

async function createChannel(channelData) {
  try {
    const newChannel = new channelModel({
      ChannelId: channelData.channelId,
      Title: channelData.title,
      Description: channelData.description,
      Thumbnails: [],
      PublishedAt: new Date(channelData.publishedAt),
      TopicCategories: [],
      Username: channelData.customUrl || null,
      uploads: parseInt(channelData.videoCount, 10),
      Subs: parseInt(channelData.subscriberCount, 10),
      VideoViews: parseInt(channelData.viewCount, 10),
    });

    if (channelData.brandingSettings.image !== undefined) {
      newChannel.BannerImage =
        channelData.brandingSettings.image.bannerExternalUrl;
    }

    for (const thumbnailType in channelData.thumbnails) {
      newChannel.Thumbnails.push(channelData.thumbnails[thumbnailType].url);
    }

    if (channelData.topicDetails !== undefined) {
      for (const tType in channelData.topicDetails.topicCategories) {
        newChannel.TopicCategories.push(
          channelData.topicDetails.topicCategories[tType]
        );
      }
    }

    await channelModel.create(newChannel);
    console.log(`New channel inserted for ${channelData.channelId}`);
    await userService.calculateAndUpdateRatings();
    return newChannel;
  } catch (error) {
    console.error(`Error inserting channel data: ${error}`);
  }
}

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
      return createChannel({
        channelId: channelId,
        title: youtubeData.snippet.title,
        description: youtubeData.snippet.description,
        thumbnails: youtubeData.snippet.thumbnails,
        publishedAt: youtubeData.snippet.publishedAt,
        customUrl: youtubeData.snippet.customUrl,
        videoCount: youtubeData.statistics.videoCount,
        subscriberCount: youtubeData.statistics.subscriberCount,
        viewCount: youtubeData.statistics.viewCount,
        brandingSettings: youtubeData.brandingSettings,
        topicDetails: youtubeData.topicDetails,
      });
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
  const apiCallName = "trendingChannels";

  const cacheEntry = await Cache.findOne({ apiCall: apiCallName });

  if (
    cacheEntry &&
    currentTime - cacheEntry.lastCallTimestamp < 24 * 60 * 60 * 1000
  ) {
    return cacheEntry.cachedData;
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
    cacheEntry.cachedData = randomChannels;
    await cacheEntry.save();
  } else {
    await Cache.create({
      apiCall: apiCallName,
      lastCallTimestamp: currentTime,
      cachedData: randomChannels,
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

exports.search = async (query) => {
  try {
    // Step 1: Check if the query is in badSearches
    const badSearchesCache = await Cache.findOne({
      apiCall: "badSearches",
    }).exec();

    if (badSearchesCache) {
      const now = new Date();
      const lastCallTimestamp = badSearchesCache.lastCallTimestamp;

      // Check if it's been more than 24 hours (86400000 milliseconds) since the last call
      if (now - lastCallTimestamp >= 86400000) {
        // Clear the cachedData list
        badSearchesCache.cachedData = [];
        badSearchesCache.lastCallTimestamp = now;
        await badSearchesCache.save();
        console.log("Cleared bad searches cache.");
      }

      if (
        badSearchesCache.cachedData.includes(query) ||
        badSearchesCache.cachedData.some((badQuery) =>
          query.startsWith(badQuery)
        )
      ) {
        console.log(
          "Query found in bad searches cache. Returning 'No results found!'"
        );
        return "No results found!";
      }
    }

    // Step 2: Search for the channel in the database using the title
    const channelsFromDB = await channelModel
      .find({
        $or: [
          { Title: { $regex: query, $options: "i" } },
          { Username: { $regex: query, $options: "i" } },
        ],
      })
      .exec();

    if (channelsFromDB.length > 0) {
      console.log("Found results in the database.");
      return channelsFromDB.slice(0, 5);
    }

    // Step 3: Search for the channel using the YouTube API
    const response = await youtube.search.list({
      part: "snippet",
      q: query,
      maxResults: 5,
      type: "channel",
    });

    const channelResults = response.data.items;

    if (channelResults.length > 0) {
      const modifiedResults = [];

      for (const channel of channelResults) {
        const channelId = channel.id.channelId;
        await userService.getChannelDetailsAndInsertOrUpdate(channelId);
        console.log(`Found channel in youtubeApi for ${channelId}`);

        // Create the modified object and push it to the modifiedResults array
        const modifiedChannel = {
          ChannelId: channelId,
          Title: channel.snippet.title,
          Thumbnails: channel.snippet.thumbnails.default.url,
        };
        modifiedResults.push(modifiedChannel);
      }

      // Finally, return the modified results from the YouTube API.
      console.log("Returning modified results from the YouTube API.");
      return modifiedResults;
    } else {
      // If no results found from YouTube API, add the query to badSearches
      badSearchesCache.cachedData.push(query);
      await badSearchesCache.save();
      console.log(
        "Query added to bad searches cache. Returning 'No results found!'"
      );
      return "No results found!";
    }
  } catch (error) {
    console.error("Error performing YouTube channel search:", error);
    return "An error occurred while searching.";
  }
};
