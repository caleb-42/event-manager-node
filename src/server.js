const http = require("http");
const urlPackage = require("url");
const routes = require("./routes");
const dotenv = require("dotenv");
const { parse } = require("querystring");
const { serveStaticFiles } = require("./utils/index");
const { authMiddleware } = require("./middlewares/auth");

dotenv.config();

const server = http.createServer(function (req, res) {
  //console.log(req.url);
  let parsedURL = urlPackage.parse(req.url, true);
  let path = parsedURL.pathname;
  // parsedURL.pathname  parsedURL.query
  // standardize the requested url by removing any '/' at the start or end
  // '/folder/to/file/' becomes 'folder/to/file'

  path = path.replace(/^\/+|\/+$/g, "");
  console.log("path", path);

  const { url: val } = req;
  console.log("url", val);
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
    payload += chunk.toString(); // convert Buffer to string
  });
  req.on("end", function () {
    //request part is finished... we can send a response now
    console.log("send a response");
    //let body = parse(payload);
    //we will use the standardized version of the path
    let route =
      typeof routes[path] !== "undefined" ? routes[path] : routes["notFound"];
    let data = {
      path: path,
      queryString: qs,
      headers: headers,
      method: method.toUpperCase(),
      body: method.toUpperCase() === "GET" ? {} : JSON.parse(payload),
    };
    //pass data incase we need info about the request
    //pass the response object because router is outside our scope
    route(data, res);
  });
});

server.listen(process.env.PORT, function () {
  console.log("Listening on port " + process.env.PORT);
});
