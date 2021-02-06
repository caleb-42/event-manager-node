const dbHandler = require("../database/dbHandler");
const utils = require("../utils");
const { notFound } = require("../utils");

const methods = {
  POST: async function (data, res) {
    const newEvent = data.body;
    try {
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
  },
  GET: async function (data, res) {
    try {
      const {
        queryString: { id },
      } = data;
      console.log(id);
      if (id === undefined) {
        payload = await dbHandler.event.getEvents();
      } else {
        payload = await dbHandler.event.getEvent(id);
        if (!payload)
          return utils.response(res, {
            message: "event not found",
            status: 404,
          });
        payload.speakers = await utils.splitSpeakers(payload.speakers);
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
  PATCH: async function (data, res) {
    try {
      const {
        body: event,
        queryString: { id },
      } = data;
      console.log(id);
      let foundEvent = await dbHandler.find("events", { id }, ["id"]);
      if (!foundEvent)
        return utils.response(res, {
          message: "event not found",
          status: 404,
        });
      let payload = await dbHandler.event.updateEvent(id, event, foundEvent);
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
  },
  DELETE: async function (data, res) {
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
  },
};

module.exports = async function (data, res) {
  if (methods[data.method]) {
    return methods[data.method](data, res);
  } else {
    return notFound(data, res);
  }
};
