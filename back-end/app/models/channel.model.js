const mongoose = require("mongoose");

const Channel = mongoose.model(
  "Channel",
  new mongoose.Schema({
    channelID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
  })
);

module.exports = Channel;
