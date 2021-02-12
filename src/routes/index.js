const { authMiddleware, authValidation } = require("../middlewares/auth");
const events = require("./events");
const { login } = require("./auth");
const eventTypes = require("./eventTypes");
const utils = require("../utils");
const registrations = require("./registrations");

module.exports = {
  "api/events": events,
  "api/event/registration": (data, res) => registrations.main(data, res),
  "api/event-types": (data, res) => authMiddleware(data, res, eventTypes),
  "api/auth/login": (data, res) => authValidation(data, res, login),
  "api/registration/notify": async (data, res) =>
    authMiddleware(data, res, registrations.registrationNotify),
  notFound: (data, res) =>
    utils.response(res, {
      error: "resource not Found",
      status: 404,
    }),
};
