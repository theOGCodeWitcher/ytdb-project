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
    const results = await userService.getChannelDetailsAndInsertOrUpdate(
      req.query.channelId
    );
    res.status(200).send(results);
  } catch (error) {
    logger.error("Failed to fetch results:", error);
    res.status(500).send("Failed to fetch results");
  }
};
