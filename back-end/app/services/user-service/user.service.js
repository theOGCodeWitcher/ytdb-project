const models = require("../../models");
const { logger } = require("../../config").loggerConfig;
const { google } = require("googleapis");
const mongoose = models.mongoose;
const channelModel = models.channelModel;
const process = require("process");

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

exports.searchYoutube = async (searchQuery) => {
  try {
    console.log("searchQuery:", searchQuery);
    const response = await youtube.search.list({
      part: "snippet",
      q: searchQuery,
    });

    if (response.data.items) {
      return response.data.items;
    } else {
      throw new Error("No items found in YouTube search response.");
    }
  } catch (err) {
    logger.error("Error while searching YouTube:", err);
    throw err;
  }
};
