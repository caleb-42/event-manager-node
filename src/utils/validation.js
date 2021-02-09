const joi = require("joi");

module.exports = {
  validateLogIn: (user) => {
    const schema = {
      /* id: joi.number().equal(0), */
      username: joi.string().required(),
      password: joi.string().min(5).max(255).required(),
    };
    return joi.validate(user, schema, { stripUnknown: true });
  },
  validateCreateEvent: (user) => {
    const schema = {
      name: joi.string().required(),
      description: joi.string().min(3).required(),
      location: joi.string(),
      event_types: joi
        .array()
        .unique()
        .items(joi.number().integer())
        .required(),
      start_date: joi.date().iso().required(),
      end_date: joi.date().iso().required(),
    };
    return joi.validate(user, schema, { stripUnknown: true });
  },
  validateCreateRegistration: (user) => {
    const schema = {
      email: joi.string().email().required(),
      event_id: joi.number().integer().required(),
    };
    return joi.validate(user, schema, { stripUnknown: true });
  },
  validateCreateEventType: (user) => {
    const schema = {
      name: joi.string().required(),
    };
    return joi.validate(user, schema, { stripUnknown: true });
  },
  validateUpdateEvent: (user) => {
    const schema = {
      name: joi.string(),
      description: joi.string().max(3),
      speakers: joi
        .array()
        .unique((a, b) => a.name === b.name)
        .items(
          joi.object({
            name: joi.string().required(),
            desc: joi.string().required(),
            pic: joi.string().optional(),
          })
        ),
      event_types: joi.array().unique().items(joi.number().integer()),
      start_date: joi.date().iso(),
      end_date: joi.date().iso(),
    };
    return joi.validate(user, schema, { stripUnknown: true });
  },
};
