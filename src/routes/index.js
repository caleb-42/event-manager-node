module.exports = {
  kenny: function (data, res) {
    // this function called if the path is 'kenny'
    let payload = {
      name: "Kenny",
      data,
    };
    let payloadStr = JSON.stringify(payload);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.write(payloadStr);
    res.end("\n");
  },
};
