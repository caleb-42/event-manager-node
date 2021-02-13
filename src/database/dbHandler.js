const dotenv = require("dotenv");
const { Pool } = require("pg");
const EventDbHandler = require("./eventDbHandler");
const EventTypeDbHandler = require("./eventTypeDbHandler");
const RegistrationDbHandler = require("./registrationDbHandler");

dotenv.config();

const { NODE_ENV, DATABASE_TEST, DATABASE_URL } = process.env;

class DbHandler {
  constructor() {
    this.pool = new Pool({
      connectionString:
        NODE_ENV === "production" ? `${DATABASE_URL}` : DATABASE_TEST,
      ...(NODE_ENV === "production"
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    });
    this.event = new EventDbHandler(this.pool);
    this.eventType = new EventTypeDbHandler(this.pool);
    this.registration = new RegistrationDbHandler(this.pool);
  }

  async find(table, body, query, key = null) {
    const param = [];
    if (!key) key = query;
    let str = `SELECT * FROM ${table} WHERE`;
    query.forEach((elem, index) => {
      str += ` ${elem} = $${index + 1}`;
      if (query.length - 1 > index) str += " AND";
      param.push(body[key[index]]);
    });
    const { rows } = await this.pool.query(str, param);
    return rows.length === 0 ? null : rows[0];
  }
}

const dbHandler = new DbHandler();
module.exports = dbHandler;
