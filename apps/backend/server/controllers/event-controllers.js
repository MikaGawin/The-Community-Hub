const { selectEvents, selectEventsCount } = require("../models/event-models");

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
