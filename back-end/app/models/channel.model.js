const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  ChannelId: String,
  Username: String,
  Title: String,
  uploads: Number,
  Subs: Number,
  VideoViews: Number,
  Favourite: Boolean,
  Wishlist: Boolean,
  Rating: String,
  Category: String,
  TopicCategories: [String],
  ExtractedCategories: [String],
  Description: String,
  PublishedAt: Date,
  lastUpdated: Date,
  Thumbnails: [String],
  BannerImage: String,
  Rank: String,
  Grade: String,
  RecentVideos: [
    {
      title: String,
      videoId: String,
      publishedAt: Date,
      publishedAtRelative: String,
      viewCount: Number,
      likeCount: Number,
      commentCount: Number,
    },
  ],
  PopularVideos: [
    {
      title: String,
      videoId: String,
      publishedAt: Date,
      publishedAtRelative: String,
      viewCount: Number,
      likeCount: Number,
      commentCount: Number,
    },
  ],
});

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
