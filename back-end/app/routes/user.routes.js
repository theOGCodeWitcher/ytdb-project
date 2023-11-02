const controller = require("../controllers");
const userController = controller.userController;

const config = require("../config");
const endPointConfig = config.endPointConfig;

module.exports = function (app) {
  app.get(endPointConfig.userEndpoint + "/login", userController.login);
  app.get(
    endPointConfig.userEndpoint + "/getUserProfile",
    userController.getUserProfile
  );
  app.put(
    endPointConfig.userEndpoint + "/updateUserProfile",
    userController.updateUserProfile
  );
  app.delete(
    endPointConfig.userEndpoint + "/deleteUserProfile",
    userController.deleteUserProfile
  );
  app.post(
    endPointConfig.userEndpoint + "/createReview",
    userController.createReview
  );
  app.put(
    endPointConfig.userEndpoint + "/updateReview/",
    userController.updateReview
  );
  app.delete(
    endPointConfig.userEndpoint + "/deleteReview/",
    userController.deleteReview
  );
  app.get(
    endPointConfig.userEndpoint + "/getReviewsByUserId/",
    userController.getReviewsByUserId
  );
  app.get(
    endPointConfig.userEndpoint + "/getReviewsByChannelAndUser/",
    userController.getReviewByChannelAndUser
  );
};
