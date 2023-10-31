const mongoose = require("mongoose");

const cacheSchema = new mongoose.Schema({
  apiCall: String,
  lastCallTimestamp: Date,
  cachedData: Array,
});

const Cache = mongoose.model("Cache", cacheSchema);

module.exports = Cache;
