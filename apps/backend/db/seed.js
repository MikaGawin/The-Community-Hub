const format = require("pg-format");
const db = require("./connection");
const { createReference } = require("./utils");

const seed = ({ userData, eventData, subscribedEventsData }) => {
  return db
    .query("DROP TABLE IF EXISTS subscribed_events;")
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS events;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        forename VARCHAR NOT NULL,
        surname VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        gmail VARCHAR,
        password VARCHAR NOT NULL,
        avatar_url VARCHAR,
        staff boolean DEFAULT false,
        UNIQUE (email)
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE events (
        event_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        date TIMESTAMP NOT NULL,
        text VARCHAR NOT NULL,
        event_owner INT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
        pictures VARCHAR ARRAY,
        fb_link VARCHAR
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE subscribed_events (
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
        event_id INT REFERENCES events(event_id) ON DELETE CASCADE NOT NULL     
        );`);
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users ( forename, surname, email, gmail, password, avatar_url, staff) VALUES %L;",
        userData.map(({ forename, surname, email, gmail, password, avatar_url, staff }) => [
          forename,
          surname,
          email,
          gmail,
          password,
          avatar_url,
          staff,
        ])
      );
      return db.query(insertUsersQueryStr);
    })
    .then(() => {
      const insertEventsQueryStr = format(
        "INSERT INTO events (title, date, text, event_owner, pictures, fb_link) VALUES %L;",
        eventData.map(
          ({ title, date, text, event_owner, pictures, fb_link }) => [
            title,
            date,
            text,
            event_owner,
            pictures ? `{${pictures.join(",")}}` : null,
            fb_link,
          ]
        )
      );
      return db.query(insertEventsQueryStr);
    })
    .then(() => {
      const insertsubscribedEventsQueryStr = format(
        "INSERT INTO subscribed_events ( user_id, event_id ) VALUES %L;",
        subscribedEventsData.map(({ user_id, event_id }) => [user_id, event_id])
      );
      return db.query(insertsubscribedEventsQueryStr);
    });
};

module.exports = seed;
