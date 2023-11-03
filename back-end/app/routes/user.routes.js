const controller = require("../controllers");
const userController = controller.userController;

const config = require("../config");
const endPointConfig = config.endPointConfig;

module.exports = function (app) {
  app.post(endPointConfig.userEndpoint + "/login", userController.login);
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
  app.post(
    endPointConfig.userEndpoint + "/addToWishlist",
    userController.addToWishlist
  );
  app.post(
    endPointConfig.userEndpoint + "/addToFavourites",
    userController.addToFavourites
  );
  app.put(
    endPointConfig.userEndpoint + "/updateReview",
    userController.updateReview
  );
  app.put(
    endPointConfig.userEndpoint + "/updateWishlist",
    userController.updateWishlist
  );
  app.put(
    endPointConfig.userEndpoint + "/updateFavourites",
    userController.updateFavourites
  );
  app.delete(
    endPointConfig.userEndpoint + "/deleteReview",
    userController.deleteReview
  );
  app.delete(
    endPointConfig.userEndpoint + "/removeFromWishlist",
    userController.removeFromWishlist
  );
  app.delete(
    endPointConfig.userEndpoint + "/removeFromFavourites",
    userController.removeFromFavourites
  );
  app.get(
    endPointConfig.userEndpoint + "/getReviewsByUserId",
    userController.getReviewsByUserId
  );
  app.get(
    endPointConfig.userEndpoint + "/getWishlist",
    userController.getWishlist
  );
  app.get(
    endPointConfig.userEndpoint + "/getFavourites",
    userController.getFavourites
  );
  app.get(
    endPointConfig.userEndpoint + "/getReviewsByChannelAndUser",
    userController.getReviewByChannelAndUser
  );
};
