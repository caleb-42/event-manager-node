const dbHandler = require("../database/dbHandler");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const utils = require("../utils");
const validation = require("../utils/validation");

dotenv.config();

module.exports = {
  createEventTypeValidation: (data, res, next) => {
    const result = validation.validateCreateEventType(data.body);
    if (result.error) {
      return utils.response(res, {
        status: 400,
        error: result.error.details[0].message,
      });
    }
    data.body = result.value;
    next(data, res);
  },
};
