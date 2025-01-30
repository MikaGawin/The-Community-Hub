const bcrypt = require("bcrypt");
const {
  insertUser,
  checkEmailExists,
  getUserByEmail,
} = require("../models/user-models");

exports.postUser = (req, res, next) => {
  const requiredData = ["forename", "surname", "email", "password"];

  for (const dataName of requiredData) {
    if (!req.body[dataName]) {
      return res.status(400).send({ msg: `${dataName} is required` });
    }
  }
  const passwordAndUserCheck = [];
  passwordAndUserCheck.push(bcrypt.hash(req.body.password, 10));
  passwordAndUserCheck.push(checkEmailExists(req.body.email));
  return Promise.all(passwordAndUserCheck).then(
    ([hashedPassword, emailExists]) => {
      if (emailExists) {
        return res.status(409).send({ msg: "Email already exists" });
      }
      insertUser(req.body, hashedPassword)
        .then((user) => {
          res.status(201).send({ user });
        })
        .catch(next);
    }
  );
};

exports.checkUser = async (email, password) => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw { status: 404, msg: "User not found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, msg: "Incorrect password" };
    }

    return user;
  } catch (err) {
    throw err;
  }
};
