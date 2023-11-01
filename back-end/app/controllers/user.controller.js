const service = require("../services");
const { logger } = require("../config").loggerConfig;
const userService = service.userService;

exports.getAllChannels = async (req, res) => {
  try {
    const channels = await userService.getAllChannels();
    res.status(200).send(channels);
  } catch (error) {
    logger.error("Failed to fetch channels:", error);
    res.status(500).send("Failed to fetch channels");
  }
};

exports.getSearchResults = async (req, res) => {
  try {
    const results = await userService.search(req.query.keyword);
    res.status(200).send(results);
  } catch (error) {
    logger.error("Failed to fetch results:", error);
    res.status(500).send("Failed to fetch results");
  }
};

exports.getChannelById = async (req, res) => {
  try {
    const results = await userService.getChannelById(req.query.channelId);
    res.status(200).send(results);
  } catch (error) {
    logger.error("Failed to fetch results:", error);
    res.status(500).send("Failed to fetch results");
  }
};

exports.getRecentVideosByChannelId = async (req, res) => {
  try {
    const results = await userService.getRecentVideosByChannelId(
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
    const results = await userService.getPopularVideosByChannelId(
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
    const results = await userService.searchByCriteria(
      req.query.key,
      req.query.value
    );
    res.status(200).send(results);
  } catch (error) {
    logger.error("Failed to fetch results:", error);
    res.status(500).send("Failed to fetch results");
  }
};

exports.getRandom10Channels = async (req, res) => {
  try {
    const channels = await userService.getRandomChannels();
    res.status(200).send(channels);
  } catch (error) {
    logger.error("Failed to fetch channels:", error);
    res.status(500).send("Failed to fetch channels");
  }
};

exports.updateChannelsData = async (req, res) => {
  try {
    await userService.tryToUpdateChannelsData();
  } catch (error) {
    logger.error("Failed to fetch result:", error);
  }
};
