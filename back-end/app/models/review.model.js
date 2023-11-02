const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  channelId: String,
  userId: String,
  rating: String,
  review: String,
  tags: [String],
});

const review = mongoose.model("Review", reviewSchema);

module.exports = review;
