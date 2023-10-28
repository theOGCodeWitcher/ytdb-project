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
};
