const pathPackage = require("path");
const fs = require("fs");

module.exports = {
  serveStaticFiles: function (url, res) {
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
  },
};
