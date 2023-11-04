const mongoose = require("mongoose");

const recGraphSchema = new mongoose.Schema({
  channelId: String,
  recommendations: [String],
});

const RecGraph = mongoose.model("RecGraph", recGraphSchema);

module.exports = RecGraph;
