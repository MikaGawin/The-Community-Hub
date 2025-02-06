const db = require("../../db/connection");
const format = require("pg-format");

exports.selectEvents = ({
  startDate,
  latestDate,
  search,
  sortBy,
  page = 1,
  limit = 20,
  sortOrder = "ASC",
}) => {
  let sqlQuery = `SELECT *, 
      CASE 
        WHEN LOWER(title) LIKE LOWER($1) THEN 1 
        WHEN LOWER(text) LIKE LOWER($2) THEN 2 
        WHEN LOWER(location) LIKE LOWER($3) THEN 3 
        ELSE 4 
      END AS search_priority
      FROM events WHERE 1=1`;

  const queries = [];
  const offset = (page - 1) * limit;

  if (startDate) {
    sqlQuery += ` AND date >= $${queries.length + 4}`;
    queries.push(startDate);
  }

  if (latestDate) {
    sqlQuery += ` AND date <= $${queries.length + 4}`;
    queries.push(latestDate);
  }

  if (search) {
    sqlQuery += ` AND (LOWER(title) LIKE LOWER($1) 
                        OR LOWER(text) LIKE LOWER($2) 
                        OR LOWER(location) LIKE LOWER($3))`;
    queries.unshift(`%${search}%`, `%${search}%`, `%${search}%`);
  } else {
    queries.unshift(null, null, null);
  }

  sortOrder = sortOrder.toUpperCase();
  if (sortOrder !== "ASC" && sortOrder !== "DESC") {
    sortOrder = "ASC";
  }

  const validSortColumns = ["date", "title", "location"];
  if (!validSortColumns.includes(sortBy)) {
    sortBy = "search_priority";
    sortOrder = "ASC";
  }

  sqlQuery += ` ORDER BY ${sortBy} ${sortOrder}`;

  sqlQuery += ` LIMIT $${queries.length + 1} OFFSET $${queries.length + 2}`;
  queries.push(limit, offset);

  return db.query(sqlQuery, queries).then(({ rows }) => {
    return rows;
  });
};

exports.selectEventsCount = ({ startDate, latestDate, search }) => {
  let sqlQuery = `SELECT COUNT(*) FROM events WHERE 1=1`;
  const queries = [];
  if (startDate) {
    sqlQuery += ` AND date >= $${queries.length + 1}`;
    queries.push(startDate);
  }

  if (latestDate) {
    sqlQuery += ` AND date <= $${queries.length + 1}`;
    queries.push(latestDate);
  }

  if (search) {
    sqlQuery += ` AND (LOWER(title) LIKE LOWER($${queries.length + 1}) 
                      OR LOWER(text) LIKE LOWER($${queries.length + 2}) 
                      OR LOWER(location) LIKE LOWER($${queries.length + 3}))`;
    queries.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  return db.query(sqlQuery, queries).then(({ rows }) => {
    return rows[0].count;
  });
};

exports.selectedUsersEvents = (userId) => {
  sqlQuery = `
  SELECT e.*
  FROM subscribed_events se
  JOIN events e ON se.event_id = e.event_id
  WHERE se.user_id = $1
  AND e.date >= CURRENT_DATE
  ORDER BY e.date ASC;
  `;

  return db.query(sqlQuery, [userId]).then(({ rows }) => {
    return rows;
  });
};

exports.createEvent = ({
  title,
  date,
  finishDate,
  location,
  description,
  owner,
  fbEvent,
  instaLink,
  image = null,
}) => {
  const pictures = [image];
  const data = [
    title,
    date,
    finishDate,
    location,
    100,
    description,
    owner,
    pictures ? `{${pictures.join(",")}}` : null,
    fbEvent || null,
    null,
    instaLink || null,
    null,
  ];
  const insertEventsQueryStr = format(
    "INSERT INTO events (title, date, end_date, location, capacity, text, event_owner, pictures, fb_link, twitter_link, instagram, calendar_event_id) VALUES %L RETURNING *;",
    [data]
  );
  return db.query(insertEventsQueryStr).then(({ rows }) => {
    return rows[0];
  });
};

exports.selectEventById = (eventid) => {
  const sqlQuery = `SELECT * from events
  WHERE event_id = $1;`;

  return db.query(sqlQuery, [eventid]).then(({ rows }) => {
    return rows;
  });
};

exports.findEventsByUser = (eventId, userId) => {
  const sqlQuery = `SELECT * from subscribed_events
  WHERE event_id = $1 AND user_id = $2;`;

  return db.query(sqlQuery, [eventId, userId]).then(({ rows }) => {
    return rows;
  });
};

exports.insertUserSubscribed = (eventId, userId) => {
  const sqlQuery = `INSERT INTO subscribed_events (user_id, event_id)
  VALUES ($1, $2)
  RETURNING *`;

  return db.query(sqlQuery, [userId, eventId]).then(({ rows }) => {
    return rows;
  });
};

exports.deleteUserSubscribed = (eventId, userId) => {
  const sqlQuery = `DELETE FROM subscribed_events 
                    WHERE user_id = $1 AND event_id = $2 
                    RETURNING *`;

  return db.query(sqlQuery, [userId, eventId]).then(({ rows }) => {
    return rows;
  });
};

exports.removeEventById = (eventId) => {
  const sqlQuery = `DELETE FROM events WHERE event_id = $1;`;

  return db.query(sqlQuery, [eventId]).then(({ rowCount }) => {
    if (!rowCount) {
      return Promise.reject({
        msg: "Event not found",
        status: 404,
      });
    }
  });
};
