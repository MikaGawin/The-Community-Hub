const db = require("../../db/connection");

exports.checkEmailExists = (email) => {
  const sqlQuery = `
    SELECT email FROM users
    WHERE email = $1
    ;`;
  return db.query(sqlQuery, [email]).then(({ rows }) => {
    if (rows.length) {
      return true;
    } else {
      return false;
    }
  });
};

exports.insertUser = ({ forename, surname, email }, hashedPassword) => {
  const sqlQuery = `
    INSERT INTO users
    (forename, surname, email, password)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *;`;
  const sqlValues = [forename, surname, email, hashedPassword];
  return db.query(sqlQuery, sqlValues).then(({ rows }) => {
    const user = rows[0];
    user.password = "";
    return user;
  });
};

exports.selectUserByEmail = async (email) => {
  const sqlQuery = `
  SELECT * FROM users
  WHERE email = $1;`;
  return db.query(sqlQuery, [email]).then(({ rows }) => {
    return rows[0];
  });
};

exports.getUserById = async (userId) => {
  const sqlQuery = `
  SELECT * FROM users
  WHERE user_id = $1;`;
  return db.query(sqlQuery, [userId]).then(({ rows }) => {
    return rows[0];
  });
};

exports.changeUserPassword = (userid, password) => {
  const sqlQuery = `
  UPDATE users 
  SET password = $1 
  WHERE user_id = $2 
  RETURNING user_id;
`;
  return db.query(sqlQuery, [password, userid]).then(({ rows }) => {
    return rows[0];
  });
};

exports.changeStaffStatusById = (userid) => {
  const sqlQuery =
    "UPDATE users SET staff = true WHERE user_id = $1 RETURNING *";
  return db.query(sqlQuery, [userid]).then(({ rows }) => {
    return rows;
  });
};
