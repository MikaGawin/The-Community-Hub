const {
  selectEvents,
  selectEventsCount,
  selectedUsersEvents,
} = require("../models/event-models");

exports.getEvents = (req, res, next) => {
  const queries = req.query;
  const eventsAndCount = [];
  eventsAndCount.push(selectEvents(queries));
  eventsAndCount.push(selectEventsCount(queries));
  Promise.all(eventsAndCount)
    .then(([events, eventCount]) => {
      res.status(200).send({ events, eventCount });
    })
    .catch(next);
};

exports.getUserEvents = (req, res, next) => {
  userId = req.user.id;
  return selectedUsersEvents(userId)
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch(next);
};
