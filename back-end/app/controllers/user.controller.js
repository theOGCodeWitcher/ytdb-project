const service = require("../services");
const { logger } = require("../config").loggerConfig;
const userService = service.userService;

exports.login = async (req, res) => {
  try {
    const userData = req.body;
    const user = await userService.login(userData);
    res.status(200).send(user);
  } catch (error) {
    logger.error("Failed to fetch user:", error);
    res.status(500).send("Failed to fetch user");
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await userService.getUserProfile(userId);

    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    logger.error("Failed to fetch user:", error);
    res.status(500).send("Failed to fetch user");
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.query.userId;
    const updatedUserData = req.body;

    const updatedUser = await userService.updateUserProfile(
      userId,
      updatedUserData
    );

    if (updatedUser) {
      res.status(200).send(updatedUser);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    logger.error("Failed to update user profile:", error);
    res.status(500).send("Failed to update user profile");
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    const userId = req.query.userId;

    const deletedUser = await userService.deleteUserProfile(userId);

    if (deletedUser) {
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    logger.error("Failed to delete user profile:", error);
    res.status(500).send("Failed to delete user profile");
  }
};

exports.createReview = async (req, res) => {
  try {
    const { channelId, userId, rating, review, tags } = req.body;
    const newReview = await userService.createReview(
      channelId,
      userId,
      rating,
      review,
      tags
    );
    res.status(201).send(newReview);
  } catch (error) {
    logger.error("Failed to create a review:", error);
    res.status(500).send("Failed to create a review");
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { reviewId, rating, review, tags } = req.body;
    const updatedReview = await userService.updateReview(
      reviewId,
      rating,
      tags,
      review
    );
    if (updatedReview) {
      res.status(200).send(updatedReview);
    } else {
      res.status(404).send("Review not found");
    }
  } catch (error) {
    logger.error("Failed to update a review:", error);
    res.status(500).send("Failed to update a review");
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.query.reviewId;
    const deletedReview = await userService.deleteReview(reviewId);
    if (deletedReview) {
      res.status(200).send("Review deleted successfully");
    } else {
      res.status(404).send("Review not found");
    }
  } catch (error) {
    logger.error("Failed to delete a review:", error);
    res.status(500).send("Failed to delete a review");
  }
};

exports.getReviewsByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;
    const reviews = await userService.getReviewsByUserId(userId);
    res.status(200).send(reviews);
  } catch (error) {
    logger.error("Failed to fetch reviews:", error);
    res.status(500).send("Failed to fetch reviews");
  }
};

exports.getReviewByChannelAndUser = async (req, res) => {
  try {
    const channelId = req.query.channelId;
    const userId = req.query.userId;
    const review = await userService.getReviewsByChannelAndUser(
      channelId,
      userId
    );
    if (review) {
      res.status(200).send(review);
    } else {
      res.status(404).send("Review not found");
    }
  } catch (error) {
    logger.error("Failed to fetch review:", error);
    res.status(500).send("Failed to fetch review");
  }
};
