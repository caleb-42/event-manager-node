const { authMiddleware, authValidation } = require("../middlewares/auth");
const events = require("./events");
const { login } = require("./auth");

module.exports = {
  events: (data, res) => authMiddleware(data, res, events),
  "auth/login": (data, res) => authValidation(data, res, login),
  notFound: (data, res) =>
    utils.response(res, {
      error: "resource not Found",
      status: 404,
    }),
};
