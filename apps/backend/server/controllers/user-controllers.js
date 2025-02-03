const bcrypt = require("bcrypt");
const {
  insertUser,
  checkEmailExists,
  getUserByEmail,
  getUserById,
  changeUserPassword,
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

exports.patchUserPassword = async (req, res, next) => {
  const { userid } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (req.user.id.toString() !== userid.toString()) {
    return res
      .status(403)
      .send({ message: "Unauthorized: Incorrect User ID." });
  }

  try {
    const user = await getUserById(userid);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Incorrect password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await changeUserPassword(userid, hashedPassword);

    res.status(204).send();
  } catch (err) {
    console.error(err);
    next(err);
  }
};
