const express = require("express");
const cors = require("cors");

const { postUser } = require("./controllers/user-controllers");
const {
  invalidEndpoint,
  internalServerError,
} = require("./errorHandling/error-handlers");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res, next) => {
  res.send("The app is working!").catch(next);
});

app.route("/users").post(postUser);

app.all("*", invalidEndpoint);

app.use(internalServerError);

module.exports = app;
