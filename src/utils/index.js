const pathPackage = require("path");
const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");
const constants = require("./constants");

dotenv.config();

const { API_KEY } = process.env;

const utils = {};

utils.serveStaticFiles = function (url, res) {
  const filePath = `./public/assets${url}`;
  // Get the extension name aka the string after the dot. For example, a url like
  // https://example.com/assets/main.css will result in extension name of css.
  const extname = String(pathPackage.extname(filePath)).toLowerCase();
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".woff": "application/font-woff",
    ".ttf": "application/font-ttf",
    ".eot": "application/vnd.ms-fontobject",
    ".otf": "application/font-otf",
    ".wasm": "application/wasm",
  };
  const contentType = mimeTypes[extname] || "application/octet-stream";
  console.log(filePath);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Sorry, check with the site admin for error: ${err.code}`);
    } else {
      res.writeHead(200, { "Content-Type": contentType }); // indicate the request was successful
      res.end(content, "utf-8");
    }
  });
};

utils.axiosCall = async ({
  method = "GET",
  host = "",
  payload = {},
  headers: hdrs = {},
}) => {
  const headers = {
    "Content-Type": "application/json",
    ...hdrs,
  };

  const axiosData = {
    method,
    url: host,
    data: payload,
    headers,
    json: true,
    /* httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }), */
  };

  return axios(axiosData);
};

utils.formatSpeakers = async (spkrs) => {
  let index = Math.floor(Math.random() * 100);
  let speakers = "";
  let faces = [];

  try {
    let pics = await utils.axiosCall({
      host: constants.API.RANDOM_PICS,
      headers: {
        Authorization: `API_KEY ${API_KEY}`,
      },
    });
    faces = pics.data && pics.data.faces;
  } catch (e) {
    console.log(e);
    faces = [];
  }

  spkrs.forEach((item, ind) => {
    let pic = "";
    try {
      let item = faces[index];
      pic = item.urls[item.urls.length - 1]["512"];
    } catch (e) {
      pic = "/avatar.png";
    }
    speakers += `name:${item.name}|desc:${item.desc}|image:${pic}${
      ind === spkrs.length - 1 ? "" : ","
    }`;
  });
  return speakers;
};

utils.notFound = function (data, res) {
  let payload = {
    message: "resource not Found",
    code: 404,
  };
  let payloadStr = JSON.stringify(payload);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(404);

  res.write(payloadStr);
  res.end("\n");
};

module.exports = utils;
