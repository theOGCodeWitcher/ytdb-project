const controller = require("../controllers");
const userController = controller.userController;

const config = require("../config");
const endPointConfig = config.endPointConfig;

module.exports = function (app) {
  app.get(
    endPointConfig.generalEndpoint + "/getAllChannels",
    userController.getAllChannels
  );
  app.get(
    endPointConfig.generalEndpoint + "/search",
    userController.getSearchResults
  );
  app.get(
    endPointConfig.generalEndpoint + "/getChannelById",
    userController.getChannelById
  );
  app.get(
    endPointConfig.generalEndpoint + "/searchByCriteria",
    userController.searchByCriteria
  );
  app.get(
    endPointConfig.generalEndpoint + "/getTrendingChannels",
    userController.getTrendingChannels
  );
  app.get(
    endPointConfig.generalEndpoint + "/getRecentVideosByChannelId",
    userController.getRecentVideosByChannelId
  );
  app.get(
    endPointConfig.generalEndpoint + "/getPopularVideosByChannelId",
    userController.getPopularVideosByChannelId
  );
};
