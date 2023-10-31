const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  ChannelId: String,
  Username: String,
  Title: String,
  uploads: Number,
  Subs: Number,
  VideoViews: Number,
  Rating: String,
  Category: String,
  TopicCategories: [String],
  ExtractedCategories: [String],
  Description: String,
  PublishedAt: Date,
  Thumbnails: [String],
  BannerImage: String,
  Rank: String,
  Grade: String,
});

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
