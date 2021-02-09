const dbHandler = require("../database/dbHandler");
const { createRegistrationValidation } = require("../middlewares/registration");
const utils = require("../utils");
const { notFound } = require("../utils");

const methods = {
  POST: async (data, res) =>
    createRegistrationValidation(data, res, async function (data, res) {
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
        let resp = await utils.sendEmail(body.email, foundEvent, body.name);
        let newBody = {
          ...body,
          notified: false,
        };
        if (resp.status == 1) {
          newBody.notified = true;
        }
        payload = await dbHandler.registration.createRegistration(newBody);
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
    }),
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

module.exports = {
  main: async function (data, res) {
    if (methods[data.method]) {
      return methods[data.method](data, res);
    } else {
      return notFound(data, res);
    }
  },
  registrationNotify: async (data, res) => {
    if (data.method !== "PATCH") {
      console.log(res);
      return utils.response(res, {
        error: "unhandled http method",
        status: 405,
      });
    }

    try {
      const {
        queryString: { id },
      } = data;
      console.log(id);
      let foundRegistration = await dbHandler.registration.getRegistration(id);
      if (!foundRegistration) {
        return utils.response(res, {
          message: "registration not found",
          status: 404,
        });
      }
      if (foundRegistration.notified) {
        return utils.response(res, {
          message: "you cannot notify a user twice about an event",
          status: 400,
        });
      }

      // send email to user
      let resp = await utils.sendEmail(
        foundRegistration.email,
        foundRegistration
      );

      if (resp.status == 1) {
        let payload = await dbHandler.registration.notifyRegistration(id);
        return utils.response(res, {
          data: payload,
          message: "notification sent successfully",
          status: 200,
        });
      }
      return utils.response(res, {
        message: "failed to send email notification",
        status: 500,
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
