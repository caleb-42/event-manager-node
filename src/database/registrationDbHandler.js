const { values } = require("lodash");
const _ = require("lodash");

module.exports = class RegistrationDbHandler {
  constructor(pool) {
    this.pool = pool;
  }

  async createRegistration(newEventType) {
    const _registration = _.pick(newEventType, [
      "email",
      "name",
      "notified",
      "event_id",
    ]);
    const { rows } = await this.pool.query(
      `INSERT INTO registrations (email, name, notified, event_id) 
        VALUES ($1, $2, $3, $4) RETURNING *`,
      Object.values(_registration)
    );
    const createdRegistration = rows[0];
    return createdRegistration;
  }

  async notifyRegistration(id) {
    const { rows } = await this.pool.query(
      `UPDATE registrations SET notified=true WHERE id=${id}`
    );

    return rows[0];
  }

  async getRegistration(id) {
    const {
      rows,
    } = await this.pool.query(
      `SELECT registrations.*, events.* FROM registrations INNER JOIN events ON (events.id = registrations.event_id) WHERE registrations.id = $1`,
      [id]
    );
    return rows.length === 0 ? null : rows[0];
  }

  async getRegistrations(options) {
    const _registration = _.pick(options, ["event_id", "email", "notified"]);

    let condition = "";

    condition = Object.entries(_registration).reduce((prev, curr, ind) => {
      let key = curr[0];
      let value = curr[1];
      if (value === undefined) return prev;
      let cond = prev;

      cond += ind === 0 || prev === "" ? "" : "AND ";
      cond += `${key}${key !== "email" ? "=" : " ILIKE "}${
        key !== "email" ? "'" + value + "'" : "'%" + value + "%'"
      }`;

      return cond;
    }, "");
    const { rows } = await this.pool.query(
      `SELECT events.name as event_name, events.start_date, registrations.* FROM registrations INNER JOIN events ON (events.id = registrations.event_id)${
        condition ? " WHERE " : ""
      }${condition}`
    );
    return rows;
  }
};
