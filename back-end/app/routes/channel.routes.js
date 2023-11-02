const controller = require("../controllers");
const channelController = controller.channelController;

const config = require("../config");
const endPointConfig = config.endPointConfig;

module.exports = function (app) {
  app.get(
    endPointConfig.channelEndpoint + "/getAllChannels",
    channelController.getAllChannels
  );
  app.get(
    endPointConfig.channelEndpoint + "/search",
    channelController.getSearchResults
  );
  app.get(
    endPointConfig.channelEndpoint + "/getChannelById",
    channelController.getChannelById
  );
  app.get(
    endPointConfig.channelEndpoint + "/searchByCriteria",
    channelController.searchByCriteria
  );
  app.get(
    endPointConfig.channelEndpoint + "/getTrendingChannels",
    channelController.getTrendingChannels
  );
  app.get(
    endPointConfig.channelEndpoint + "/getRecentVideosByChannelId",
    channelController.getRecentVideosByChannelId
  );
  app.get(
    endPointConfig.channelEndpoint + "/getPopularVideosByChannelId",
    channelController.getPopularVideosByChannelId
  );
  app.get(
    endPointConfig.channelEndpoint + "/getReviewsByChannelId/",
    channelController.getReviewsByChannelId
  );
};
