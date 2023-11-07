const service = require("../services");
const { logger } = require("../config").loggerConfig;
const channelService = service.channelService;

exports.getAllChannels = async (req, res) => {
  try {
    const channels = await channelService.getAllChannels();
    res.status(200).send(channels);
  } catch (error) {
    logger.error("Failed to fetch channels:", error);
    res.status(500).send("Failed to fetch channels");
  }
};

exports.getSearchResults = async (req, res) => {
  try {
    const results = await channelService.search(req.query.keyword);
    res.status(200).send(results);
  } catch (error) {
    logger.error("Failed to fetch results:", error);
    res.status(500).send("Failed to fetch results");
  }
};

exports.getChannelById = async (req, res) => {
  try {
    const results = await channelService.getChannelById(
      req.query.channelId,
      req.query.userId
    );
    res.status(200).send(results);
  } catch (error) {
    logger.error("Failed to fetch results:", error);
    res.status(500).send("Failed to fetch results");
  }
};

exports.getRecentVideosByChannelId = async (req, res) => {
  try {
    const results = await channelService.getRecentVideosByChannelId(
      req.query.channelId
    );
    res.status(200).send(results);
  } catch (error) {
    logger.error("Failed to fetch results:", error);
    res.status(500).send("Failed to fetch results");
  }
};

exports.getPopularVideosByChannelId = async (req, res) => {
  try {
    const results = await channelService.getPopularVideosByChannelId(
      req.query.channelId
    );
    res.status(200).send(results);
  } catch (error) {
    logger.error("Failed to fetch results:", error);
    res.status(500).send("Failed to fetch results");
  }
};

exports.searchByCriteria = async (req, res) => {
  try {
    const results = await channelService.searchByCriteria(
      req.query.key,
      req.query.value
    );
    res.status(200).send(results);
  } catch (error) {
    logger.error("Failed to fetch results:", error);
    res.status(500).send("Failed to fetch results");
  }
};

exports.getTrendingChannels = async (req, res) => {
  try {
    const channels = await channelService.getTrendingChannels();
    res.status(200).send(channels);
  } catch (error) {
    logger.error("Failed to fetch channels:", error);
    res.status(500).send("Failed to fetch channels");
  }
};

exports.tryToUpdateChannelsData = async (req, res) => {
  try {
    await channelService.tryToUpdateChannelsData();
  } catch (error) {
    logger.error("Failed to fetch result:", error);
  }
};

exports.getReviewsByChannelId = async (req, res) => {
  try {
    const channelId = req.query.channelId;
    const reviews = await channelService.getReviewsByChannelId(channelId);
    res.status(200).send(reviews);
  } catch (error) {
    logger.error("Failed to fetch reviews:", error);
    res.status(500).send("Failed to fetch reviews");
  }
};

exports.getSimilarChannels = async (req, res) => {
  try {
    const channels = await channelService.getSimilarChannelsDetails(
      req.query.channelId
    );
    res.status(200).send(channels);
  } catch (error) {
    logger.error("Failed to fetch channels:", error);
    res.status(500).send("Failed to fetch channels");
  }
};
