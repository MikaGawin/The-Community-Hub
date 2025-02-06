const {
  selectEvents,
  selectEventsCount,
  selectedUsersEvents,
  createEvent,
  selectEventById,
  findEventsByUser,
  insertUserSubscribed,
  deleteUserSubscribed,
  removeEventById,
} = require("../models/event-models");
const upload = require("../utils/uploadConfig");
const convertToTimestamp = require("../utils/combineDateAndTime");

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

exports.postEvent = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).send({
        msg: err.message || "An error occurred while uploading the image.",
      });
    }
    const {
      title,
      location,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      fbEvent,
      instaLink,
    } = req.body;

    const date = convertToTimestamp(startDate, startTime);
    const finishDate = convertToTimestamp(endDate, endTime);
    const image = req.file;

    const eventData = {
      title,
      location,
      description,
      date,
      finishDate,
      fbEvent: fbEvent || null,
      instaLink: instaLink || null,
    };

    eventData.owner = req.user.id;

    if (image) {
      eventData.image = image.path;
    }

    createEvent(eventData)
      .then((event) => {
        res.status(200).send({ event });
      })
      .catch(next);
  });
};

exports.getEventById = (req, res, next) => {
  const eventid = req.params.eventid;
  selectEventById(eventid)
    .then((event) => {
      if (!event[0]) {
        res.status(404).send({ message: "event not found" });
      } else res.status(200).send({ event: event[0] });
    })
    .catch(next);
};

exports.checkSubscribed = (req, res, next) => {
  const eventId = req.params.eventid;
  const userId = req.user.id;

  findEventsByUser(eventId, userId)
    .then((rows) => {
      const subscribed = {};
      if (rows.length > 0) {
        subscribed.subscribed = true;
      } else {
        subscribed.subscribed = false;
      }
      res.status(200).send({ subscribed });
    })
    .catch(next);
};
exports.toggleSubscribed = (req, res, next) => {
  const eventId = req.params.eventid;
  const userId = req.user.id;

  findEventsByUser(eventId, userId)
    .then((rows) => {
      if (rows.length > 0) {
        deleteUserSubscribed(eventId, userId).then((rows) => {
          if (rows.length > 0) {
            res.status(200).send({ subscribed: false });
          } else {
            res.status(500).send({ error: "Failed to subscribe" });
          }
        });
      } else {
        insertUserSubscribed(eventId, userId).then((rows) => {
          if (rows.length > 0) {
            res.status(200).send({ subscribed: true });
          } else {
            res.status(500).send({ error: "Failed to unsubscribe" });
          }
        });
      }
    })
    .catch(next);
};

exports.deleteEventById = (req, res, next) => {
  const eventId = req.params.eventid;
  removeEventById(eventId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
