const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  given_name: String,
  family_name: String,
  nickname: String,
  bio: String,
  age: Number,
  ytdbUsername: String,
  name: String,
  picture: String,
  locale: String,
  updated_at: Date,
  email: String,
  email_verified: Boolean,
  sub: String,
  channelsBrowsed: Map,
});

const user = mongoose.model("User", userSchema);

module.exports = user;
