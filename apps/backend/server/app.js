const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `${__dirname}/../../../.env.${ENV}`,
});

const {
  postUser,
  checkUser,
  patchUserPassword,
  getUserByEmail,
  patchStaffStatusById,
  patchRemoveStaff,
} = require("./controllers/user-controllers");
const {
  getEvents,
  getUserEvents,
  postEvent,
  getEventById,
  checkSubscribed,
  toggleSubscribed
} = require("./controllers/event-controllers");
const {
  invalidEndpoint,
  internalServerError,
  handleCustomError,
  invalidQuery,
} = require("./errorHandling/error-handlers");

const app = express();

const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      forename: user.forename,
      surname: user.surname,
      email: user.email,
      gmail: user.gmail,
      avatar_url: user.avatar_url,
      staff: user.staff,
    },
    SECRET_KEY,
    { expiresIn: "2h" }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send({ msg: "Invalid or expired token." });
  }
};

const authenticateStaffToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded.staff) {
      return res
        .status(403)
        .send({ message: "Access denied. User is not a staff member." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send({ msg: "Invalid or expired token." });
  }
};

app.use(cors());
app.use(express.json());

//routes

app.get("/", (req, res, next) => {
  res.send("The app is working!").catch(next);
});

app.route("/events").get(getEvents);
app.route("/event/${}");
app.route("/register").post(postUser);
app.route("/login").post(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await checkUser(email, password);
    const token = generateToken(user);
    res.status(200).send({ token, user });
  } catch (err) {
    next(err);
  }
});

app.route("/user/password/:userid").patch(authenticateToken, patchUserPassword);
app.route("/event/:eventid").get(getEventById)
app.route("/user/events/:userId").get(authenticateToken, getUserEvents);
app.route("/user/details").get(authenticateStaffToken, getUserByEmail);
app
  .route("/user/details/makestaff/:userid")
  .patch(authenticateStaffToken, patchStaffStatusById);
app
  .route("/user/details/revokestaff")
  .patch(authenticateStaffToken, patchRemoveStaff);
app.route("/events").post(authenticateStaffToken, postEvent);
app.route("/event/checkSubscribed/:eventid").get(authenticateToken, checkSubscribed)
app.route("/event/toggleSubscribed/:eventid").patch(authenticateToken, toggleSubscribed)
app.all("*", invalidEndpoint);

app.use(handleCustomError);
app.use(invalidQuery);
app.use(internalServerError);

module.exports = app;
