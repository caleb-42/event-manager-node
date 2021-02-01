const dotenv = require("dotenv");
const _ = require("lodash");
const axios = require("axios");
const { Pool } = require("pg");
const { formatSpeakers } = require("../utils");

dotenv.config();

const { NODE_ENV, DATABASE_TEST, DATABASE_PROD } = process.env;

class DbHandler {
  constructor() {
    this.pool = new Pool({
      connectionString: NODE_ENV === "PROD" ? DATABASE_URL : DATABASE_TEST,
    });
  }

  async find(table, body, query, key = null) {
    /* find any record in database */
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
    return rows[0];
  }

  async createEvent(newEvent) {
    const _event = _.pick(newEvent, [
      "admin_id",
      "name",
      "description",
      "speakers",
      "start_date",
      "end_date",
    ]);
    _event.speakers = await formatSpeakers(_event.speakers);
    try {
      const { rows } = await this.pool.query(
        `INSERT INTO events (
        admin_id, name, description, speakers, start_date, end_date) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        Object.values(_event)
      );
      const createdEvent = rows[0];
      return createdEvent;
    } catch (err) {
      console.log(err);
      return 500;
    }
  }
}

const dbHandler = new DbHandler();
module.exports = dbHandler;
