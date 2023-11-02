const mongoose = require("mongoose");
const channelModel = require("./channel.model");
const cacheModel = require("./cache.model");
const userModel = require("./user.model");
const reviewModel = require("./review.model");
module.exports = {
  channelModel,
  cacheModel,
  userModel,
  reviewModel,
  mongoose,
};
