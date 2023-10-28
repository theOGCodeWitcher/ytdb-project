const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  Rank: String,
  Grade: String,
  Username: String,
  uploads: Number,
  Subs: Number,
  VideoViews: Number,
  Category: String,
  ChannelId: String,
  Title: String,
  Description: String,
  Thumbnails: [String],
  PublishedAt: Date,
  TopicCategories: [String],
  Rating: String,
});

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
