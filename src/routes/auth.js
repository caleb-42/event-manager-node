const { notFound } = require("../utils");
const bcrypt = require("bcrypt");
const utils = require("../utils");
const dbHandler = require("../database/dbHandler");

const loginMethods = {
  POST: async function (data, res) {
    try {
      const user = data.body;
      user.username = user.username.toLowerCase();
      const foundUser = await dbHandler.find(
        "admins",
        { username: user.username },
        ["username"]
      );
      console.log(foundUser);
      if (!foundUser) {
        return utils.response(res, {
          error: "Access denied, User does not exist",
          status: 404,
        });
      }

      const validPassword = await bcrypt.compare(
        user.password,
        foundUser.password
      );

      if (!validPassword) {
        return utils.response(res, {
          error: "Invalid username or password",
          status: 400,
        });
      }

      const token = validPassword
        ? utils.generateJWT({
            username: foundUser.username,
            id: foundUser.id,
          })
        : false;

      return utils.response(res, {
        data: {
          token,
          username: foundUser.username,
        },
        message: "authentication successful",
        status: 200,
      });
    } catch (e) {
      console.log(e);
      return utils.response(res, {
        error: "Server error",
        status: 500,
      });
    }
  },
};

module.exports = {
  login: async function (data, res) {
    if (loginMethods[data.method]) {
      return loginMethods[data.method](data, res);
    } else {
      console.log(res);
      return utils.response(res, {
        error: "unhandled http method",
        status: 405,
      });
    }
  },
};
