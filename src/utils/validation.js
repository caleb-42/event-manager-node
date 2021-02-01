const joi = require("joi");

module.exports = {
  validateLogIn: (user) => {
    const schema = {
      /* id: joi.number().equal(0), */
      username: joi.string().required(),
      password: joi.string().min(5).max(255).required(),
    };
    return joi.validate(user, schema);
  },
};
