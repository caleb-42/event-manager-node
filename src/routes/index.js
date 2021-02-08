const { authMiddleware, authValidation } = require("../middlewares/auth");
const { createEventTypeValidation } = require("../middlewares/event-type");
const { createRegistrationValidation } = require("../middlewares/registration");
const events = require("./events");
const { login } = require("./auth");
const eventTypes = require("./eventTypes");
const utils = require("../utils");
const registrations = require("./registrations");
const dbHandler = require("../database/dbHandler");

module.exports = {
  events: events,
  "event/registration": (data, res) =>
    createRegistrationValidation(data, res, registrations),
  "event-types": (data, res) =>
    authMiddleware(data, res, (data, res) =>
      createEventTypeValidation(data, res, eventTypes)
    ),
  "auth/login": (data, res) => authValidation(data, res, login),
  "registration/notify": async (data, res) =>
    authMiddleware(data, res, async (data, res) => {
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
        let foundRegistration = await dbHandler.registration.getRegistration(
          id
        );
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
    }),
  notFound: (data, res) =>
    utils.response(res, {
      error: "resource not Found",
      status: 404,
    }),
};
