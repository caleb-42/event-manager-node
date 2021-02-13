const http = require("http");
const urlPackage = require("url");
const routes = require("./routes");
const dotenv = require("dotenv");
const { parse } = require("querystring");
const { serveStaticFiles } = require("./utils/index");
const { authMiddleware } = require("./middlewares/auth");

dotenv.config();

const server = http.createServer(function (req, res) {
  let parsedURL = urlPackage.parse(req.url, true);
  let path = parsedURL.pathname;
  // parsedURL.pathname  parsedURL.query
  // standardize the requested url by removing any '/' at the start or end
  // '/folder/to/file/' becomes 'folder/to/file'

  path = path.replace(/^\/+|\/+$/g, "");

  const { url: val } = req;
  let url = val;
  if (/\/event\/[0-9]+$/.test(val)) {
    return serveStaticFiles("/event.html", res);
  } else if (/\/event-edit\/[0-9]+$/.test(val)) {
    return serveStaticFiles("/event-edit.html", res);
  }
  if (!/api\/[a-z]+/.test(url)) {
    let urls = val.split("/");
    url = `/${urls[urls.length - 1]}`;
  }
  if (/^\/[a-zA-Z0-9-_]+\.[a-zA-Z]+/.test(url)) {
    return serveStaticFiles(url, res);
  } else if (path == "") return serveStaticFiles("/index.html", res);

  if (!/api\/[a-z]+/.test(url)) return serveStaticFiles("/404.html", res);

  let qs = parsedURL.query;
  let headers = req.headers;
  let method = req.method.toLowerCase();
  let payload = "";

  req.on("data", (chunk) => {
    payload += chunk.toString();
  });
  req.on("end", function () {
    let route =
      typeof routes[path] !== "undefined" ? routes[path] : routes["notFound"];
    let data = {
      path: path,
      queryString: qs,
      headers: headers,
      method: method.toUpperCase(),
      body: method.toUpperCase() === "GET" ? {} : JSON.parse(payload),
    };
    route(data, res);
  });
});

server.listen(process.env.PORT, function () {
  console.log("Listening on port " + process.env.PORT);
});
