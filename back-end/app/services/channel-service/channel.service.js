const models = require("../../models");
const { topicToCategory, categoryMap } = require("../../constants/categories");
const { google } = require("googleapis");
const channelModel = models.channelModel;
const Cache = models.cacheModel;
const reviewModel = models.reviewModel;
const userModel = models.userModel;
const process = require("process");
const channelService = require("./channel.service");
const moment = require("moment");
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

exports.getTrendingChannels = async () => {
  try {
    const results = await fetchPopularVideosAndChannels("");
    return results;
  } catch (error) {
    console.error(`Error fetching popular videos and channels: ${error}`);
    return null;
  }
};

exports.searchByCriteria = async (key, videoCategory) => {
  try {
    const categoryID = categoryMap[videoCategory.toLowerCase()];

    if (!categoryID) {
      console.error("Invalid video category.");
      return null;
    }

    const results = await fetchPopularVideosAndChannels(categoryID);
    return results;
  } catch (error) {
    console.error(`Error fetching popular videos and channels: ${error}`);
    return null;
  }
};

async function fetchPopularVideosAndChannels(videoCategoryId) {
  const currentTime = Date.now();
  const apiCallName = `trendingChannels_${videoCategoryId}`;
  const cacheEntry = await Cache.findOne({ apiCall: apiCallName });

  if (
    cacheEntry &&
    currentTime - cacheEntry.lastCallTimestamp < 24 * 60 * 60 * 1000
  ) {
    return cacheEntry.cachedData;
  }

  const processedChannels = new Set();
  const results = [];
  //console.log(`Fetching popular videos for category ${videoCategoryId}`);
  const videoCategoryIdParam = videoCategoryId ? { videoCategoryId } : {};

  const popularVideosResponse = await youtube.videos.list({
    part: "snippet,statistics",
    chart: "mostPopular",
    maxResults: 15,
    ...videoCategoryIdParam,
  });

  const popularVideos = popularVideosResponse.data.items;

  for (const video of popularVideos) {
    const channelId = video.snippet.channelId;

    if (!processedChannels.has(channelId)) {
      const channel = await channelService.getChannelById(channelId);
      results.push(channel);
      processedChannels.add(channelId);
    }
  }

  if (cacheEntry) {
    cacheEntry.lastCallTimestamp = currentTime;
    cacheEntry.cachedData = results;
    await cacheEntry.save();
  } else {
    await Cache.create({
      apiCall: apiCallName,
      lastCallTimestamp: currentTime,
      cachedData: results,
    });
  }

  return results;
}

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
        await fetchAndCreateOrUpdateChannelAsync(channelId);
        console.log(`Found channel in youtubeApi for ${channelId}`);

        // Create the modified object and push it to the modifiedResults array
        const modifiedChannel = {
          ChannelId: channelId,
          Title: channel.snippet.title,
          Thumbnails: Object.values(channel.snippet.thumbnails).map(
            (thumbnail) => thumbnail.url
          ),
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

exports.getChannelById = async (channelId, userId) => {
  try {
    const existingChannel = await channelModel
      .findOne({
        ChannelId: channelId,
      })
      .exec();
    if (userId) {
      const user = await userModel.findById(userId).exec();
      if (user) {
        if (!user.channelsBrowsed || !(user.channelsBrowsed instanceof Map)) {
          user.channelsBrowsed = new Map();
        }
        const channelsBrowsed = user.channelsBrowsed;
        if (channelsBrowsed.has(channelId)) {
          channelsBrowsed.set(channelId, new Date());
        } else {
          channelsBrowsed.set(channelId, new Date());
        }
        user.save();
      }
    }

    if (!existingChannel) {
      console.log(`Channel with ID ${channelId} not found.`);
      return await fetchAndCreateOrUpdateChannelAsync(
        channelId,
        existingChannel
      );
    }
    if (existingChannel && existingChannel.lastUpdated) {
      const currentTime = Date.now();
      const lastUpdatedTime = existingChannel.lastUpdated.getTime();
      const cacheTimeout = 24 * 60 * 60 * 1000;

      if (currentTime - lastUpdatedTime >= cacheTimeout) {
        return await fetchAndCreateOrUpdateChannelAsync(
          channelId,
          existingChannel
        );
      } else {
        return existingChannel;
      }
    } else {
      return await fetchAndCreateOrUpdateChannelAsync(
        channelId,
        existingChannel
      );
    }
  } catch (error) {
    console.error(`Error getting channel data for ${channelId}: ${error}`);
  }
};

async function fetchAndCreateOrUpdateChannelCommon(channelId) {
  const response = await youtube.channels.list({
    part: "snippet,statistics,brandingSettings,topicDetails",
    id: channelId,
  });

  const youtubeData = response.data.items[0];

  if (!youtubeData) {
    console.log(`Channel with ID ${channelId} not found.`);
    return null;
  }

  const newChannelData = {
    channelId: channelId,
    title: youtubeData.snippet.title,
    description: youtubeData.snippet.description,
    thumbnails: [],
    publishedAt: new Date(youtubeData.snippet.publishedAt),
    customUrl: youtubeData.snippet.customUrl || null,
    videoCount: parseInt(youtubeData.statistics.videoCount, 10),
    subscriberCount: parseInt(youtubeData.statistics.subscriberCount, 10),
    viewCount: parseInt(youtubeData.statistics.viewCount, 10),
    ExtractedCategories: [],
  };

  if (youtubeData.brandingSettings.image !== undefined) {
    newChannelData.bannerImage =
      youtubeData.brandingSettings.image.bannerExternalUrl;
  }

  for (const thumbnailType in youtubeData.snippet.thumbnails) {
    newChannelData.thumbnails.push(
      youtubeData.snippet.thumbnails[thumbnailType].url
    );
  }

  const updatedCategories = new Set();
  if (youtubeData.topicDetails !== undefined) {
    newChannelData.topicCategories = youtubeData.topicDetails.topicCategories;
    const ExtractedCategories = new Set();

    for (const topicCategory of youtubeData.topicDetails.topicCategories) {
      const topicMatch = topicCategory.match(/\/wiki\/(.+)$/);
      if (topicMatch && topicMatch[1]) {
        const topic = topicMatch[1];
        updatedCategories.add(topic.replace(/_/g, " "));
        ExtractedCategories.add(topic);
        const category = topicToCategory[topic];
        if (category) {
          ExtractedCategories.add(category);
        }
      }
    }
    newChannelData.TopicCategories = Array.from(updatedCategories);

    newChannelData.ExtractedCategories = Array.from(ExtractedCategories);
  }

  newChannelData.rating = await channelService.updateMyRating(
    newChannelData.subscriberCount,
    newChannelData.publishedAt,
    newChannelData.viewCount,
    newChannelData.videoCount
  );
  newChannelData.lastUpdated = new Date();
  return newChannelData;
}

async function fetchAndCreateOrUpdateChannelAsync(channelId, existingChannel) {
  const newChannelData = await fetchAndCreateOrUpdateChannelCommon(channelId);

  if (newChannelData) {
    const existingChannel = await channelModel
      .findOne({ ChannelId: channelId })
      .exec();

    if (existingChannel) {
      existingChannel.set(newChannelData);
      await existingChannel.save();
      console.log(`Channel updated for ${channelId}`);
      return existingChannel;
    } else {
      const newChannel = createChannel(newChannelData);
      console.log(`New channel inserted for ${channelId}`);
      return newChannel;
    }
  }
}

exports.updateMyRating = async (subs, publishedAt, views, uploads) => {
  try {
    const totalSubscribers = 252000000;
    const totalAgeInDays = 6437;
    const totalViews = 236294326678;
    const totalVideos = 19727;

    const subscribersWeight = 0.3; // Weight for subscribers
    const ageWeight = 0.2; // Weight for channel age
    const viewsWeight = 0.4; // Weight for video views
    const videosWeight = 0.1; // Weight for number of videos

    const subscribersRating = (subs / totalSubscribers) * 5;
    const ageInDays = calculateAgeInDays(publishedAt, new Date());
    const ageRating =
      totalAgeInDays === 0 ? 0 : (ageInDays / totalAgeInDays) * 5;
    const viewsRating = (views / totalViews) * 5;
    const videosRating = totalVideos === 0 ? 0 : (uploads / totalVideos) * 5;

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

    let Rating = parseFloat(overallRating.toFixed(1));
    return Rating;
  } catch (error) {
    console.error("Error updating ratings:", error);
  }
};

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
exports.getRecentVideosByChannelId = async (channelId) => {
  const existingChannel = await channelModel
    .findOne({ ChannelId: channelId })
    .exec();
  try {
    // const existingChannel = await channelModel
    //   .findOne({ ChannelId: channelId })
    //   .exec();
    console.log("existingChannel", existingChannel);
    const response = await youtube.channels.list({
      part: "snippet,statistics,brandingSettings,topicDetails,contentDetails",
      id: channelId,
    });

    const youtubeData = response.data.items[0];

    if (!youtubeData) {
      console.log(`Channel with ID ${channelId} not found.`);
      // If YouTube data is not found, check if existing channel has recent videos
      if (existingChannel && existingChannel.RecentVideos) {
        return existingChannel.RecentVideos;
      }
      return null;
    }

    const uploadsPlaylistId =
      youtubeData.contentDetails.relatedPlaylists.uploads;

    const recentVideosResponse = await youtube.playlistItems.list({
      part: "snippet",
      playlistId: uploadsPlaylistId,
      maxResults: 3,
    });

    const recentVideosData = recentVideosResponse.data.items.map((video) => ({
      title: video.snippet.title,
      videoId: video.snippet.resourceId.videoId,
      publishedAt: new Date(video.snippet.publishedAt),
      publishedAtRelative: moment(video.snippet.publishedAt).fromNow(),
    }));

    for (const video of recentVideosData) {
      const videoStatsResponse = await youtube.videos.list({
        part: "statistics",
        id: video.videoId,
      });
      const videoStats = videoStatsResponse.data.items[0].statistics;
      video.viewCount = videoStats.viewCount;
      video.likeCount = videoStats.likeCount;
      video.commentCount = videoStats.commentCount;
    }

    existingChannel.RecentVideos = recentVideosData;

    await existingChannel.save();

    return recentVideosData;
  } catch (error) {
    console.error(
      `Error updating/inserting channel data for ${channelId}: ${error}`
    );

    // Check if existing channel has recent videos and return them
    if (existingChannel && existingChannel.RecentVideos) {
      return existingChannel.RecentVideos;
    }
    return null;
  }
};

exports.getPopularVideosByChannelId = async (channelId) => {
  try {
    const existingChannel = await channelModel
      .findOne({ ChannelId: channelId })
      .exec();

    if (
      existingChannel &&
      Array.isArray(existingChannel.PopularVideos) &&
      existingChannel.PopularVideos.length > 0
    ) {
      return existingChannel.PopularVideos;
    }
    const response = await youtube.channels.list({
      part: "snippet,statistics,brandingSettings,topicDetails,contentDetails",
      id: channelId,
    });

    const youtubeData = response.data.items[0];

    if (!youtubeData) {
      console.log(`Channel with ID ${channelId} not found.`);
      return null;
    }

    const uploadsPlaylistId =
      youtubeData.contentDetails.relatedPlaylists.uploads;

    // Use the "search" endpoint to get popular videos
    const popularVideosResponse = await youtube.search.list({
      part: "snippet",
      channelId: channelId,
      order: "viewCount", // Sort by view count (popular videos)
      maxResults: 3, // You can change this number as needed
    });

    const popularVideosData = popularVideosResponse.data.items.map((video) => ({
      title: video.snippet.title,
      videoId: video.id.videoId,
      publishedAt: new Date(video.snippet.publishedAt),
      publishedAtRelative: moment(video.snippet.publishedAt).fromNow(),
    }));

    for (const video of popularVideosData) {
      const videoStatsResponse = await youtube.videos.list({
        part: "statistics",
        id: video.videoId,
      });
      const videoStats = videoStatsResponse.data.items[0].statistics;
      video.viewCount = videoStats.viewCount;
      video.likeCount = videoStats.likeCount;
      video.commentCount = videoStats.commentCount;
    }

    existingChannel.PopularVideos = popularVideosData;

    await existingChannel.save();

    return popularVideosData;
  } catch (error) {
    console.error(
      `Error updating/inserting channel data for ${channelId}: ${error}`
    );
    return null;
  }
};

function createChannel(channelData) {
  try {
    const newChannel = new channelModel({
      ChannelId: channelData.channelId,
      Title: channelData.title,
      Description: channelData.description,
      Thumbnails: channelData.thumbnails,
      PublishedAt: channelData.publishedAt,
      TopicCategories: channelData.topicCategories,
      Username: channelData.customUrl || null,
      uploads: channelData.videoCount,
      Subs: channelData.subscriberCount,
      VideoViews: channelData.viewCount,
      ExtractedCategories: channelData.ExtractedCategories,
      Rating: channelData.rating,
      lastUpdated: channelData.lastUpdated,
    });

    if (channelData.bannerImage) {
      newChannel.BannerImage = channelData.bannerImage;
    }

    newChannel.save();
    console.log(`New channel inserted for ${channelData.channelId}`);
    return newChannel;
  } catch (error) {
    console.error(`Error inserting channel data: ${error}`);
    return null;
  }
}

// exports.getReviewsByChannelId = async (channelId) => {
//   return reviewModel.find({ channelId: channelId });
// };

exports.getReviewsByChannelId = async (channelId) => {
  try {
    const reviews = await reviewModel.find({ channelId: channelId });
    const reviewsWithUserInfo = [];
    for (const review of reviews) {
      const userId = review.userId;

      const user = await userModel.findById(userId);

      if (user) {
        const userName = user.name;
        const ytdbUsername = user.ytdbUsername;

        const reviewWithUserInfo = {
          review: review,
          userName: userName,
          ytdbUsername: ytdbUsername,
        };

        reviewsWithUserInfo.push(reviewWithUserInfo);
      }
    }

    return reviewsWithUserInfo;
  } catch (error) {
    console.error(`Error getting reviews with user info: ${error}`);
    return [];
  }
};

exports.getSimilarChannelsDetails = async (channelId) => {
  try {
    const similarChannels = await findSimilarChannels(channelId);
    console.log("similarChannels", similarChannels);

    const results = [];
    for (const channelId of similarChannels) {
      const channel = await channelModel
        .findOne({ ChannelId: channelId })
        .exec();
      results.push(channel);
    }
    results.sort((a, b) => b.Rating - a.Rating);
    return results.slice(0, 6);
  } catch (error) {
    console.error(`Error getting details of similar channels: ${error}`);
    return [];
  }
};

async function findSimilarChannels(channelId) {
  const MAX_RESULT_SIZE = 30;
  try {
    const channel = await channelModel.findOne({ ChannelId: channelId }).exec();

    if (
      !channel ||
      !channel.TopicCategories ||
      channel.TopicCategories.length === 0
    ) {
      return [];
    }

    const channelCounts = new Map();
    for (const category of channel.TopicCategories) {
      const matchingChannels = await channelModel
        .find({
          TopicCategories: category,
          ChannelId: { $ne: channelId },
        })
        .sort({ Rating: -1 })
        .limit(15)
        .exec();

      for (const matchingChannel of matchingChannels) {
        if (!channelCounts.has(matchingChannel.ChannelId)) {
          channelCounts.set(matchingChannel.ChannelId, 0);
        }

        channelCounts.set(
          matchingChannel.ChannelId,
          channelCounts.get(matchingChannel.ChannelId) + 1
        );
      }
    }

    const sortedChannels = [...channelCounts.entries()].sort(
      (a, b) => b[1] - a[1]
    );
    const similarChannelsArray = sortedChannels
      .slice(0, MAX_RESULT_SIZE)
      .map((entry) => entry[0]);

    shuffleArray(similarChannelsArray);
    console.log("similarChannelsArray", similarChannelsArray);
    return getRandomChannels(similarChannelsArray, 20);
  } catch (error) {
    console.error(`Error finding similar channels: ${error}`);
    return [];
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getRandomChannels(array, count) {
  return array.slice(0, count);
}
