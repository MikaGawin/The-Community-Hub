const {
  selectEvents,
  selectEventsCount,
  selectedUsersEvents,
  createEvent,
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
        console.log(event);
        res.status(200).send({ event });
      })
      .catch(next);
  });
};
