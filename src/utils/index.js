const pathPackage = require("path");
const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const constants = require("./constants");

dotenv.config();

const { API_KEY, JWT_SECRET, EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;
const utils = {};

utils.sendEmail = async (to, event, username) => {
  const mailOptions = {
    from: "event.manager.node.app@gmail.com",
    to,
    text: `hello ${username}, you have successfully registered for ${event.name} \nIt will happening by ${event.start_date}, at ${event.location}`,
    subject: "Bambi event Registration",
  };

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_ADDRESS,
      pass: EMAIL_PASSWORD,
    },
  });
  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, res) => {
      if (error) {
        console.log(error);
        resolve({ status: 0, error });
      }
      resolve({ status: 1, res });
    });
  });
};

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
      const fileP = `./public/assets/404.html`;
      fs.readFile(fileP, (err, content) => {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8");
      });
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
utils.getPics = async () => {
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
  return faces;
};
utils.formatSpeakers = async (spkrs) => {
  let speakers = [];

  let faces = await utils.getPics();

  speakers = spkrs.map((item, ind) => {
    let pic = "";
    let index = Math.floor(Math.random() * 100);
    try {
      let item = faces[index];
      pic = item.urls[item.urls.length - 1]["512"];
    } catch (e) {
      pic = "/avatar.png";
    }
    return { name: item.name, desc: item.desc, pic };
    /* speakers += `name:${item.name}|desc:${item.desc}|image:${pic}${
      ind === spkrs.length - 1 ? "" : ","
    }`; */
  });
  return JSON.stringify(speakers);
};

utils.updateSpeakers = async (spkrs) => {
  let speakers = [];
  console.log(spkrs);
  let faces = await utils.getPics();

  speakers = spkrs.map((item, ind) => {
    let pic = "";
    if (!item.pic) {
      let index = Math.floor(Math.random() * 100);
      try {
        let item = faces[index];
        pic = item.urls[item.urls.length - 1]["512"];
      } catch (e) {
        pic = "/avatar.png";
      }
    } else pic = item.pic;
    return { name: item.name, desc: item.desc, pic };
  });
  return JSON.stringify(speakers);
};

utils.splitSpeakers = async (spkrs) => {
  return JSON.parse(spkrs);
};

utils.notFound = function (data, res) {
  let payload = {
    error: "resource not Found",
    status: 404,
  };
  let payloadStr = JSON.stringify(payload);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(404);

  res.write(payloadStr);
  res.end("\n");
};

utils.response = function (res, payload) {
  let payloadStr = JSON.stringify(payload);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(payload.status);

  res.write(payloadStr);
  res.end("\n");
};

utils.generateJWT = (user) => jwt.sign(user, JWT_SECRET);

utils.verifyJWT = (token) => {
  try {
    let val = jwt.verify(token, JWT_SECRET);
    return val;
  } catch (e) {
    return null;
  }
};

module.exports = utils;
