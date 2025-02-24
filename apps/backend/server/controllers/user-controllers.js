const bcrypt = require("bcrypt");
const {
  insertUser,
  checkEmailExists,
  selectUserByEmail,
  getUserById,
  changeUserPassword,
  changeStaffStatusById,
  removeStaffStatusById
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
  ).catch(next);
};

exports.checkUser = async (email, password) => {
  try {
    const user = await selectUserByEmail(email);
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

exports.getUserByEmail = (req, res, next) => {
  const email = req.query.email;
  selectUserByEmail(email)
    .then((user) => {
      if (!user) {
        throw { status: 404, msg: "User not found" };
      } else {
        const name = user.forename + " " + user.surname;
        const userid = user.user_id;
        const { staff } = user;
        return res.status(200).send({ name, staff, userid });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchStaffStatusById = (req, res, next) => {
  const userid = req.params.userid;
  changeStaffStatusById(userid)
    .then((updatedUser) => {
      if (updatedUser.length === 0) {
        res.status(404).send({ message: "User not found" });
      } else {
        const userWithoutSensitiveData = {
          user_id: updatedUser[0].user_id,
          name: updatedUser[0].name,
          email: updatedUser[0].email,
          staff: updatedUser[0].staff,
        };
        res.status(200).send({
          message: `${userWithoutSensitiveData.name} is now a staff member.`,
          user: userWithoutSensitiveData,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchRemoveStaff = (req, res, next) => {
  const userid = req.user.id
  removeStaffStatusById(userid)
    .then((updatedUser) => {
      if (updatedUser.length === 0) {
        res.status(404).send({ message: "User not found" });
      } else {
        const userWithoutSensitiveData = {
          user_id: updatedUser[0].user_id,
          name: updatedUser[0].name,
          email: updatedUser[0].email,
          staff: updatedUser[0].staff,
        };
        res.status(200).send({
          message: `staff status removed.`,
          user: userWithoutSensitiveData,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
}