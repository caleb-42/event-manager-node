const { notFound } = require("../utils");
const events = require("./events");

module.exports = {
  events: (data, res) => events(data, res),
  notFound: notFound,
};
