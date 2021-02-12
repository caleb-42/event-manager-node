const dbHandler = require("../database/dbHandler");
const { createEventTypeValidation } = require("../middlewares/event-type");
const utils = require("../utils");
const { notFound } = require("../utils");

const methods = {
  POST: (data, res) =>
    createEventTypeValidation(data, res, async function (data, res) {
      const {
        body,
        user: { id },
      } = data;
      try {
        let foundEventType = await dbHandler.find(
          "event_types",
          { name: body.name },
          ["name"]
        );
        console.log(foundEventType);
        if (foundEventType) {
          return utils.response(res, {
            message: "event type already exist",
            status: 400,
          });
        }
        let payload = await dbHandler.eventType.createEventType({
          ...body,
          admin_id: id,
        });
        return utils.response(res, {
          data: payload,
          message: "event type created successfully",
          status: 201,
        });
      } catch (e) {
        console.log(e);
        return utils.response(res, {
          message: "Server Error",
          status: 500,
        });
      }
    }),
  GET: async function (data, res) {
    try {
      let payload = await dbHandler.eventType.getEventTypes();
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
  DELETE: async function (data, res) {
    try {
      const {
        queryString: { id },
      } = data;
      console.log(id);
      let foundEventType = await dbHandler.find("event_types", { id }, ["id"]);
      if (!foundEventType) {
        return utils.response(res, {
          message: "event type not found",
          status: 404,
        });
      }
      if (
        [
          "MeetUp",
          "Leap",
          "Recruiting Mission",
          "Hackathon",
          "Premium-only Webinar",
          "Open Webinar",
        ].includes(foundEventType.name)
      ) {
        return utils.response(res, {
          message: "you are not authorized to delete this event type",
          status: 403,
        });
      }
      let payload = await dbHandler.eventType.deleteEventType(id);
      return utils.response(res, {
        data: payload,
        message: "event type deleted successfully",
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
};

module.exports = async function (data, res) {
  if (methods[data.method]) {
    return methods[data.method](data, res);
  } else {
    return notFound(data, res);
  }
};
