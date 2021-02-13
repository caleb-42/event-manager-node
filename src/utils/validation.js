const joi = require("joi");

module.exports = {
  validateLogIn: (user) => {
    const schema = {
      username: joi.string().required(),
      password: joi.string().min(5).max(255).required(),
    };
    return joi.validate(user, schema, { stripUnknown: true });
  },
  validateCreateEvent: (user) => {
    const schema = {
      name: joi.string().required(),
      description: joi.string().min(20).required(),
      location: joi.string(),
      start_date: joi.date().iso().min(Date.now()).required(),
      end_date: joi.date().iso().min(joi.ref("start_date")).required(),
    };
    return joi.validate(user, schema, { stripUnknown: true });
  },
  validateCreateRegistration: (user) => {
    const schema = {
      email: joi.string().email().required(),
      name: joi.string().required(),
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
      description: joi.string().min(20),
      location: joi.string(),
      speakers: joi
        .array()
        .unique((a, b) => a.name === b.name)
        .items(
          joi.object({
            name: joi.string().required(),
            desc: joi
              .string()
              .required()
              .error(() => "job title is required"),
            pic: joi.string().optional(),
          })
        ),
      event_types: joi.array().unique().items(joi.number().integer()),
      start_date: joi.date().iso().min(Date.now()),
      end_date: joi.date().iso().min(joi.ref("start_date")),
    };
    return joi.validate(user, schema, { stripUnknown: true });
  },
};
