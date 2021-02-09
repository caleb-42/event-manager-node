const dbHandler = require("../database/dbHandler");
const { authMiddleware } = require("../middlewares/auth");
const {
  createEventValidation,
  updateEventValidation,
} = require("../middlewares/event");
const utils = require("../utils");
const { notFound } = require("../utils");

const methods = {
  POST: (data, res) =>
    authMiddleware(data, res, (data, res) =>
      createEventValidation(data, res, async function (data, res) {
        const newEvent = data.body;
        try {
          let foundEvent = await dbHandler.find(
            "events",
            { name: newEvent.name },
            ["name"]
          );
          console.log("foundEvent", foundEvent);
          if (foundEvent) {
            return utils.response(res, {
              message: "event already exist",
              status: 400,
            });
          }
          newEvent.admin_id = data.user.id;
          let payload = await dbHandler.event.createEvent(newEvent);
          return utils.response(res, {
            data: payload,
            message: "event created successfully",
            status: 201,
          });
        } catch (e) {
          console.log(e);
          return utils.response(res, {
            message: "Server Error",
            status: 500,
          });
        }
      })
    ),
  GET: async function (data, res) {
    try {
      const {
        queryString: { id, q },
      } = data;
      console.log(typeof id);
      if (id !== undefined && id !== "") {
        payload = await dbHandler.event.getEvent(id);
        if (!payload)
          return utils.response(res, {
            message: "event not found",
            status: 404,
          });
        payload.speakers = await utils.splitSpeakers(payload.speakers);
      } else if (q) {
        payload = await dbHandler.event.searchEvent(q);
      } else {
        payload = await dbHandler.event.getEvents();
      }
      return utils.response(res, {
        data: payload,
        status: 200,
      });
    } catch (e) {
      console.log(e);
      return utils.response(res, {
        message: "Server Error",
        status: 500,
      });
    }
  },
  PATCH: (data, res) =>
    authMiddleware(data, res, (data, res) =>
      updateEventValidation(data, res, async function (data, res) {
        try {
          const {
            body: event,
            queryString: { id },
          } = data;
          console.log(id);
          if (event.name) {
            let foundEventName = await dbHandler.find(
              "events",
              { name: event.name },
              ["name"]
            );
            if (foundEventName.name === event.name) {
              return utils.response(res, {
                message: "event already exist",
                status: 400,
              });
            }
          }
          let foundEvent = await dbHandler.find("events", { id }, ["id"]);
          if (!foundEvent)
            return utils.response(res, {
              message: "event not found",
              status: 404,
            });
          let payload = await dbHandler.event.updateEvent(
            id,
            event,
            foundEvent
          );
          return utils.response(res, {
            data: payload,
            message: "event updated successfully",
            status: 200,
          });
        } catch (e) {
          console.log(e);
          return utils.response(res, {
            message: "Server Error",
            status: 500,
          });
        }
      })
    ),
  DELETE: (data, res) =>
    authMiddleware(data, res, async function (data, res) {
      try {
        const {
          queryString: { id },
        } = data;
        console.log(id);
        let foundEvent = await dbHandler.find("events", { id }, ["id"]);
        if (!foundEvent)
          return utils.response(res, {
            message: "event not found",
            status: 404,
          });

        // reject if event has registrations
        // or aleart all registrations that the event has been cancelled

        let payload = await dbHandler.event.deleteEvent(id);
        return utils.response(res, {
          data: payload,
          message: "event deleted successfully",
          status: 200,
        });
      } catch (e) {
        console.log(e);
        return utils.response(res, {
          message: "Server Error",
          status: 500,
        });
      }
    }),
};

module.exports = async function (data, res) {
  if (methods[data.method]) {
    return methods[data.method](data, res);
  } else {
    return notFound(data, res);
  }
};
