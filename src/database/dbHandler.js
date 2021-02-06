const dotenv = require("dotenv");
const { Pool } = require("pg");
const EventDbHandler = require("./eventDbHandler");
const EventTypeDbHandler = require("./eventTypeDbHandler");

dotenv.config();

const { NODE_ENV, DATABASE_TEST, DATABASE_PROD } = process.env;

class DbHandler {
  constructor() {
    this.pool = new Pool({
      connectionString: NODE_ENV === "PROD" ? DATABASE_URL : DATABASE_TEST,
    });
    this.event = new EventDbHandler(this.pool);
    this.eventType = new EventTypeDbHandler(this.pool);
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
    console.log(str, param);
    const { rows } = await this.pool.query(str, param);
    return rows.length === 0 ? null : rows[0];
  }
}

const dbHandler = new DbHandler();
module.exports = dbHandler;
