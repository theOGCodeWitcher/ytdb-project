const mongoose = require("mongoose");
const channelModel = require("./channel.model");
const cacheModel = require("./cache.model");
module.exports = {
  channelModel,
  cacheModel,
  mongoose,
};
