const db = require("../../db/connection");

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
