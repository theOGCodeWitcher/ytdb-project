const models = require("../../models");
const { logger } = require("../../config").loggerConfig;
const { google } = require("googleapis");
const channelModel = models.channelModel;
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

      channel.Username = youtubeData.snippet.customUrl || null; // Assuming "customUrl" is a field in the API response
      channel.uploads = parseInt(youtubeData.statistics.videoCount, 10) || 0; // Assuming "videoCount" is a field in the API response
      channel.Subs = parseInt(youtubeData.statistics.subscriberCount, 10) || 0; // Assuming "subscriberCount" is a field in the API response
      channel.VideoViews = parseInt(youtubeData.statistics.viewCount, 10) || 0; // Assuming "viewCount" is a field in the API response

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

    let totalSubscribers = 252000000;
    let totalAgeInDays = 6437;
    let totalViews = 236294326678;
    let totalVideos = 19727;

    for (const channel of channels) {
      const subscribersRating = (channel.Subs / totalSubscribers) * 5;
      const currentTimestamp = new Date();
      const channelTimestamp = new Date(channel.PublishedAt);
      const ageInMilliseconds = currentTimestamp - channelTimestamp;
      const ageInDays = ageInMilliseconds / (1000 * 60 * 60 * 24); // Convert to days

      const ageRating =
        totalAgeInDays === 0 ? 0 : (ageInDays / totalAgeInDays) * 5;
      const viewsRating = (channel.VideoViews / totalViews) * 5;
      const videosRating =
        totalVideos === 0 ? 0 : (channel.uploads / totalVideos) * 5;

      const s1 = subscribersRating / ageRating;
      const s2 = viewsRating / videosRating;

      const overallRating = ((s1 + s2) / 2) * 5;
      if (overallRating > 5) {
        channel.Rating = 5;
      } else {
        channel.Rating = parseFloat(overallRating.toFixed(1));
      }

      await channel.save();
    }

    console.log("Ratings updated successfully.");
  } catch (error) {
    console.error("Error updating ratings:", error);
  }
};

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

    return {
      channels: top10Channels,
    };
  } catch (error) {
    console.error("Error in searchByCriteria:", error);
  }
};
