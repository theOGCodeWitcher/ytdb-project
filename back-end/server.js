const express = require("express");
const cors = require("cors");
const { auth } = require("express-openid-connect");
const process = require("process");
require("dotenv").config();

const configAuth = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

const config = require("./app/config/");
const serverConfig = config.serverConfig;
const logger = config.loggerConfig.logger;

const models = require("./app/models/");
const { userController } = require("./app/controllers/");
const { userService } = require("./app/services");

var corsOptions = {
  origin: process.env.CORS_ORIGIN,
};

const PORT = process.env.SERVER_PORT || 8090;

const app = express();
// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth(configAuth));

app.get("/", function (req, res) {
  res.send("Server is up!");
});

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
});

app.use(async (req, res, next) => {
  try {
    await userController.updateChannelsData();
    console.log("Request Method:", req.method);
    console.log("Request URL:", req.originalUrl);
    console.log("Request Body:", req.body);

    const oldSend = res.send;
    res.send = async function (data) {
      console.log("Response Body:", data);
      await oldSend.apply(res, arguments);
    };

    await next();
  } catch (error) {
    next(error);
  }
});

models.mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to the database!");
    initial();
  })
  .catch((err) => {
    logger.error("Cannot connect to the database!", err);
    process.exit();
  });

async function initial() {
  try {
    //const searchResult = await userService.testing();
  } catch (err) {
    logger.error("Error searching YouTube", err);
  }
}

require("./app/routes/user.routes")(app);

module.exports = app;
