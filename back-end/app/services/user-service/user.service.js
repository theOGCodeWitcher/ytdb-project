const models = require("../../models");
const userModel = models.userModel;
const reviewModel = models.reviewModel;
const channelModel = models.channelModel;
const recGraphModel = models.recGraphModel;
const channelService = require("../channel-service/channel.service");
const { google } = require("googleapis");
const process = require("process");
require("dotenv").config();
const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

exports.login = async (userData) => {
  try {
    const existingUser = await userModel
      .findOne({ email: userData.email })
      .select("-channelsBrowsed") // Exclude the channelsBrowsed field
      .exec();

    if (existingUser) {
      return existingUser;
    } else {
      const user = new userModel(userData);
      const savedUser = await user.save();
      return savedUser;
    }
  } catch (error) {
    console.error(`Error creating a user: ${error}`);
    return null;
  }
};

exports.getUserProfile = async (userId) => {
  try {
    console.log(`Fetching user profile for ID: ${userId}`);
    const user = await userModel
      .findById(userId)
      .select("-channelsBrowsed") // Exclude the channelsBrowsed field
      .exec();

    if (user) {
      return user;
    } else {
      console.log(`User not found for ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching user profile: ${error}`);
    return null;
  }
};

exports.updateUserProfile = async (userId, updatedUserData) => {
  try {
    const updatedUser = await userModel
      .findOneAndUpdate({ _id: userId }, updatedUserData, { new: true })
      .exec();

    if (updatedUser) {
      return updatedUser;
    } else {
      console.log(`User not found for ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error updating user profile: ${error}`);
    return null;
  }
};

exports.deleteUserProfile = async (userId) => {
  try {
    const deletedUser = await userModel
      .findOneAndRemove({ _id: userId })
      .exec();

    if (deletedUser) {
      return deletedUser;
    } else {
      console.log(`User not found for ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error deleting user profile: ${error}`);
    return null;
  }
};

exports.createReview = async (channelId, userId, rating, review, tags) => {
  const userReview = {
    channelId: channelId,
    userId: userId,
    rating: rating,
    review: review,
    tags: tags,
  };
  return reviewModel.create(userReview);
};

exports.updateReview = async (reviewId, rating, tags, review) => {
  const updatedReview = {
    rating: rating,
    review: review,
    tags: tags,
  };
  return reviewModel.findByIdAndUpdate(reviewId, updatedReview, { new: true });
};

exports.deleteReview = async (reviewId) => {
  return reviewModel.findByIdAndDelete(reviewId);
};

exports.getReviewsByUserId = async (userId) => {
  try {
    const reviews = await reviewModel.find({ userId: userId });
    const reviewsWithChannelInfo = [];
    for (const review of reviews) {
      const channelId = review.channelId;
      const channel = await channelModel
        .findOne({
          ChannelId: channelId,
        })
        .exec();
      if (channel) {
        const channelTitle = channel.Title;

        const reviewWithChannelInfo = {
          review: review,
          Title: channelTitle,
        };

        reviewsWithChannelInfo.push(reviewWithChannelInfo);
      }
    }

    return reviewsWithChannelInfo;
  } catch (error) {
    console.error(`Error getting reviews with channel info: ${error}`);
    return [];
  }
};

exports.getReviewsByChannelAndUser = async (channelId, userId) => {
  return reviewModel.findOne({ channelId: channelId, userId: userId });
};

exports.addToWishlist = async (userId, channelId) => {
  try {
    if (userId) {
      const user = await userModel.findById(userId).exec();
      if (user) {
        if (!user.wishlist || !(user.wishlist instanceof Map)) {
          user.wishlist = new Map();
        }
        const wishlist = user.wishlist;
        if (wishlist.has(channelId)) {
          wishlist.set(channelId, new Date());
        } else {
          wishlist.set(channelId, new Date());
        }
        await user.save();
      }
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error(`Error adding to wishlist: ${error}`);
  }
};

exports.getWishlist = async (userId) => {
  try {
    const channelInfoArrayFinal = [];
    if (userId) {
      const user = await userModel.findById(userId).exec();
      if (user && user.wishlist instanceof Map) {
        const wishlistKeys = Array.from(user.wishlist.keys());
        for (const channelId of wishlistKeys) {
          const channelInfo = await channelService.getChannelById(channelId);
          if (channelInfo) {
            channelInfoArrayFinal.push(channelInfo);
          }
        }
        return channelInfoArrayFinal;
      }
    }
    return [];
  } catch (error) {
    console.error(`Error fetching wishlist: ${error}`);
    return [];
  }
};

exports.updateWishlist = async (userId, updatedChannelIds) => {
  try {
    if (userId) {
      const user = await userModel.findById(userId).exec();
      if (user && user.wishlist instanceof Map) {
        const wishlist = user.wishlist;
        for (const channelId of wishlist.keys()) {
          if (!updatedChannelIds.includes(channelId)) {
            wishlist.delete(channelId);
          }
        }
        for (const channelId of updatedChannelIds) {
          if (!wishlist.has(channelId)) {
            wishlist.set(channelId, new Date());
          }
        }

        await user.save();
      }
    }
  } catch (error) {
    console.error(`Error updating wishlist: ${error}`);
  }
};

exports.removeFromWishlist = async (userId, channelId) => {
  try {
    if (userId) {
      const user = await userModel.findById(userId).exec();
      if (
        user &&
        user.wishlist instanceof Map &&
        user.wishlist.has(channelId)
      ) {
        user.wishlist.delete(channelId);
        await user.save();
      }
    }
  } catch (error) {
    console.error(`Error removing from wishlist: ${error}`);
  }
};

exports.addToFavourites = async (userId, channelId) => {
  try {
    if (userId) {
      const user = await userModel.findById(userId).exec();
      if (user) {
        if (!user.favourites || !(user.favourites instanceof Map)) {
          user.favourites = new Map();
        }
        const favourites = user.favourites;
        if (favourites.has(channelId)) {
          favourites.set(channelId, new Date());
        } else {
          favourites.set(channelId, new Date());
        }
        await user.save();
      }
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error(`Error adding to favourites: ${error}`);
  }
};
exports.getFavourites = async (userId) => {
  try {
    const channelInfoArrayFinal = [];
    if (userId) {
      const user = await userModel.findById(userId).exec();
      if (user && user.favourites instanceof Map) {
        const favouritesKeys = Array.from(user.favourites.keys());
        for (const channelId of favouritesKeys) {
          const channelInfo = await channelService.getChannelById(channelId);
          if (channelInfo) {
            channelInfoArrayFinal.push(channelInfo);
          }
        }
        return channelInfoArrayFinal;
      }
    }
    return [];
  } catch (error) {
    console.error(`Error fetching wishlist: ${error}`);
    return [];
  }
};

exports.updateFavourites = async (userId, updatedChannelIds) => {
  try {
    if (userId) {
      const user = await userModel.findById(userId).exec();

      if (user && user.favourites instanceof Map) {
        const favourites = user.favourites;
        for (const channelId of favourites.keys()) {
          if (!updatedChannelIds.includes(channelId)) {
            favourites.delete(channelId);
          }
        }

        for (const channelId of updatedChannelIds) {
          if (!favourites.has(channelId)) {
            favourites.set(channelId, new Date());
          }
        }

        await user.save();
      }
    }
  } catch (error) {
    console.error(`Error updating favourites: ${error}`);
  }
};

exports.removeFromFavourites = async (userId, channelId) => {
  try {
    if (userId) {
      const user = await userModel.findById(userId).exec();
      if (
        user &&
        user.favourites instanceof Map &&
        user.favourites.has(channelId)
      ) {
        user.favourites.delete(channelId);
        await user.save();
        return { message: "Channel removed from favourites successfully" };
      } else {
        return { message: "User with the provided ID or channelId not found" };
      }
    } else {
      return { message: "User with the provided ID not found" };
    }
  } catch (error) {
    console.error(`Error removing from favourites: ${error}`);
    return { error: "Error removing from favourites" };
  }
};

// exports.getRecommendations = async (userId) => {
//   try {
//     const user = await userModel.findById(userId).exec();
//     if (!user) {
//       console.log("User not found.");
//       return [];
//     }

//     const minorSet = new Set();

//     // Step 1: Get favorites latest 2 and add to minorSet
//     const favorites = Array.from(user.favourites);
//     favorites.sort((a, b) => b[1] - a[1]); // Sort by date in descending order
//     const recentFavorites = favorites.slice(0, 2).map((channel) => channel[0]);
//     recentFavorites.forEach((channelId) => minorSet.add(channelId));

//     // Step 2: Get browsed latest 2 and add to minorSet
//     const browsed = Array.from(user.channelsBrowsed);
//     browsed.sort((a, b) => b[1] - a[1]); // Sort by date in descending order
//     const recentBrowsed = browsed.slice(0, 2).map((channel) => channel[0]);
//     recentBrowsed.forEach((channelId) => minorSet.add(channelId));

//     const majorSet = new Set();

//     // Step 3: Loop over channel ids in minorSet
//     for (const channelId of minorSet) {
//       // Step 3.1: Call for channel title
//       const channelInfo = await youtube.channels.list({
//         part: "snippet",
//         id: channelId,
//       });

//       const channelTitle = channelInfo.data.items[0].snippet.title;

//       // Step 3.2: Use channel title to call for search
//       const searchResponse = await youtube.search.list({
//         part: "snippet",
//         q: channelTitle,
//         type: "video",
//         maxResults: 30,
//       });

//       const videos = searchResponse.data.items || [];

//       // Step 3.2: Extract channelIds from the search results
//       const channelIds = videos.map((video) => video.snippet.channelId);

//       // Step 3.3: Filter out the current channel's ID
//       const uniqueChannelIds = channelIds.filter((id) => id !== channelId);

//       // Step 3.4: Add unique channelIds to the majorSet
//       uniqueChannelIds.forEach((uniqueChannelId) =>
//         majorSet.add(uniqueChannelId)
//       );
//     }

//     // Return the majorSet as an array
//     // Create an array to store the results
//     const channelInfoArray = [];

//     // Loop over channel IDs in the majorSet and fetch channel information
//     for (const channelId of majorSet) {
//       const channelInfo = await channelService.getChannelById(channelId);
//       if (channelInfo) {
//         channelInfoArray.push(channelInfo);
//       }
//     }

//     return channelInfoArray;
//   } catch (error) {
//     console.error(`Error finding and storing similar channels: ${error}`);
//     return [];
//   }
// };

exports.getRecommendations = async (userId) => {
  try {
    let searchCost = 0;
    let dfsCost = 0;
    const user = await userModel.findById(userId).exec();
    if (!user) {
      console.log("User not found.");
      return [];
    }

    const minorSet = new Set();
    const recommendationGraph = {}; // Object to store recommendations as sets

    // Step 1: Get favorites latest 2 and add to minorSet
    const favorites = Array.from(user.favourites);
    favorites.sort((a, b) => b[1] - a[1]); // Sort by date in descending order
    const recentFavorites = favorites.slice(0, 5).map((channel) => channel[0]);
    recentFavorites.forEach((channelId) => minorSet.add(channelId));

    // Step 2: Get browsed latest 2 and add to minorSet
    const browsed = Array.from(user.channelsBrowsed);
    browsed.sort((a, b) => b[1] - a[1]); // Sort by date in descending order
    const recentBrowsed = browsed.slice(0, 5).map((channel) => channel[0]);
    recentBrowsed.forEach((channelId) => minorSet.add(channelId));

    const majorSet = new Set();

    // Step 3: Loop over channel ids in minorSet
    for (const channelId of minorSet) {
      // Step 3.1: Call for channel title
      const channelIdStr = channelId.toString();

      // Step 3.1: Check if the vertex exists in the recommendation graph in the database
      const existingVertex = await recGraphModel.findOne({
        channelId: channelIdStr,
      });

      if (existingVertex) {
        dfsCost += 100;
        // Vertex already exists in the database, add its connected components to majorSet
        const connectedComponents = await dfsRecommendationGraph(
          existingVertex,
          recGraphModel
        );
        connectedComponents.forEach((component) => majorSet.add(component));
      } else {
        const channelInfo = await youtube.channels.list({
          part: "snippet",
          id: channelId,
        });

        const channelTitle = channelInfo.data.items[0].snippet.title;

        // Step 3.2: Use channel title to call for search
        const searchResponse = await youtube.search.list({
          part: "snippet",
          q: channelTitle,
          type: "video",
          maxResults: 50,
        });
        searchCost += 100;
        const videos = searchResponse.data.items || [];

        // Step 3.2: Extract channelIds from the search results
        const channelIds = videos.map((video) => video.snippet.channelId);

        const uniqueChannelIds = channelIds
          .filter((id) => id !== channelId)
          .filter(
            (id, index) => !videos[index].snippet.title.includes(channelTitle)
          );

        // Convert the keys to strings (ensure consistency)
        const channelIdStr = channelId.toString();
        const uniqueChannelIdsStr = uniqueChannelIds.map((id) => id.toString());

        // Step 3.4: Add unique channelIds to the majorSet and the recommendationGraph
        uniqueChannelIdsStr.forEach(async (uniqueChannelIdStr) => {
          majorSet.add(uniqueChannelIdStr);

          // Initialize the set if it doesn't exist
          if (!recommendationGraph[channelIdStr]) {
            recommendationGraph[channelIdStr] = new Set();
          }
          if (!recommendationGraph[uniqueChannelIdStr]) {
            recommendationGraph[uniqueChannelIdStr] = new Set();
          }

          // Add uniqueChannelIdStr to the recommendationGraph for channelIdStr
          recommendationGraph[channelIdStr].add(uniqueChannelIdStr);

          // Add channelIdStr to the recommendationGraph for uniqueChannelIdStr
          recommendationGraph[uniqueChannelIdStr].add(channelIdStr);
          // Save the recommendation graph data to MongoDB
          await recGraphModel.findOneAndUpdate(
            { channelId: channelIdStr },
            { $addToSet: { recommendations: uniqueChannelIdStr } },
            { upsert: true }
          );

          await recGraphModel.findOneAndUpdate(
            { channelId: uniqueChannelIdStr },
            { $addToSet: { recommendations: channelIdStr } },
            { upsert: true }
          );
        });
      }
    }

    // Return the majorSet as an array
    const channelInfoArray = Array.from(majorSet);
    console.log("Search cost:", searchCost);
    console.log("DFS cost:", dfsCost);

    const channelInfoArrayFinal = [];

    // Loop over channel IDs in the majorSet and fetch channel information
    for (const channelId of majorSet) {
      const channelInfo = await channelService.getChannelById(channelId);
      if (channelInfo) {
        channelInfoArrayFinal.push(channelInfo);
      }
    }

    return channelInfoArrayFinal;
  } catch (error) {
    console.error(`Error finding and storing similar channels: ${error}`);
    return [];
  }
};

async function dfsRecommendationGraph(vertex, recGraphModel) {
  const visited = new Set();
  const stack = [vertex.channelId];

  const connectedComponents = new Set();

  while (stack.length > 0) {
    const currentChannelId = stack.pop();
    if (!visited.has(currentChannelId)) {
      visited.add(currentChannelId);
      connectedComponents.add(currentChannelId);

      const vertexData = await recGraphModel.findOne({
        channelId: currentChannelId,
      });
      if (vertexData) {
        const recommendations = vertexData.recommendations;
        for (const recommendation of recommendations) {
          if (!visited.has(recommendation)) {
            stack.push(recommendation);
          }
        }
      }
    }
  }

  return Array.from(connectedComponents);
}
