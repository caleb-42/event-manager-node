const dbHandler = require("../database/dbHandler");
const { notFound } = require("../utils");

const methods = {
  POST: async function (data, res) {
    const newEvent = data.body;
    let payload = await dbHandler.createEvent(newEvent);
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.write(payloadStr);
    res.end("\n");
  },
};

module.exports = async function (data, res) {
  console.log(":asasa");
  if (methods[data.method]) {
    return methods[data.method](data, res);
  } else {
    return notFound(data, res);
  }
};
