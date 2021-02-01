const dbHandler = require("../database/dbHandler");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const utils = require("../utils");
const validation = require("../utils/validation");

dotenv.config();

module.exports = {
  authMiddleware: async (data, res, next) => {
    try {
      let authHeader = data.headers.authorization;
      let token;
      if (!authHeader) {
        return utils.response(res, {
          error: "no authetication token provided",
          status: 401,
        });
      }
      if (!authHeader.startsWith("Bearer ")) {
        return utils.response(res, {
          error: "invalid auth token",
          status: 401,
        });
      }
      token = authHeader.substring(7, authHeader.length);
      const decoded = utils.verifyJWT(token);
      console.log(authHeader, decoded);
      if (!decoded) {
        return utils.response(res, {
          error: "invalid auth token",
          status: 401,
        });
      }
      const user = await dbHandler.find("admins", { id: decoded.id }, ["id"]);
      if (!user) {
        return utils.response(res, {
          error: "Access denied, User does not exist",
          status: 404,
        });
      }

      data.user = decoded;
      next(data, res);
    } catch (e) {
      console.log(e);
      return utils.response(res, {
        error: "Server error",
        status: 500,
      });
    }
  },
  authValidation: (data, res, next) => {
    const err = validation.validateLogIn(data.body).error;
    if (err) {
      req.error = { status: 400, error: err.details[0].message };
      return utils.response(res, {
        status: 400,
        error: err.details[0].message,
      });
    }
    next(data, res);
  },
};
