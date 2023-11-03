const models = require("../../models");
const userModel = models.userModel;
const reviewModel = models.reviewModel;

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
  return reviewModel.find({ userId: userId });
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
    if (userId) {
      const user = await userModel.findById(userId).exec();
      if (user && user.wishlist instanceof Map) {
        return Array.from(user.wishlist.keys());
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
    if (userId) {
      const user = await userModel.findById(userId).exec();
      if (user && user.favourites instanceof Map) {
        return Array.from(user.favourites.keys());
      }
    }
    return [];
  } catch (error) {
    console.error(`Error fetching favourites: ${error}`);
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
