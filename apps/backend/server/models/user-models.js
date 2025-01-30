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

exports.getUserByEmail = async (email) => {
  const sqlQuery = `
  SELECT * FROM users
  WHERE email = $1;`
  return db.query(sqlQuery, [email]).then(({rows}) => {
    return rows[0]
  })
}