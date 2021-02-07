const dbHandler = require("../database/dbHandler");
const utils = require("../utils");
const { notFound } = require("../utils");

const methods = {
  POST: async function (data, res) {
    const { body } = data;
    try {
      let foundEvent = await dbHandler.find("events", { id: body.event_id }, [
        "id",
      ]);
      if (!foundEvent) {
        return utils.response(res, {
          message: "event does not exist",
          status: 404,
        });
      }
      let foundRegistration = await dbHandler.find(
        "registrations",
        { event_id: body.event_id, email: body.email },
        ["event_id", "email"]
      );
      console.log(foundRegistration);
      if (foundRegistration) {
        return utils.response(res, {
          message: "you are not allowed to register for an event twice",
          status: 400,
        });
      }
      // send email to user
      let payload = await dbHandler.registration.createRegistration({
        ...body,
        notified: false,
      });
      return utils.response(res, {
        data: payload,
        message: "you have successfully registered for this event",
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
        queryString: { event_id, email, notified },
      } = data;
      let payload = await dbHandler.registration.getRegistrations({
        event_id,
        email,
        notified,
      });

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
};

module.exports = async function (data, res) {
  if (methods[data.method]) {
    return methods[data.method](data, res);
  } else {
    return notFound(data, res);
  }
};
