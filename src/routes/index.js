const { authMiddleware, authValidation } = require("../middlewares/auth");
const events = require("./events");
const { login } = require("./auth");
const eventTypes = require("./eventTypes");
const utils = require("../utils");

module.exports = {
  events: events,
  "event-types": (data, res) => authMiddleware(data, res, eventTypes),
  "auth/login": (data, res) => authValidation(data, res, login),
  notFound: (data, res) =>
    utils.response(res, {
      error: "resource not Found",
      status: 404,
    }),
};
