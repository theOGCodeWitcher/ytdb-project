const models = require("../../models");
const userModel = models.userModel;
const reviewModel = models.reviewModel;
const userService = require("./user.service");

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
