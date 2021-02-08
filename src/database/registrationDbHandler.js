const { values } = require("lodash");
const _ = require("lodash");

module.exports = class RegistrationDbHandler {
  constructor(pool) {
    this.pool = pool;
  }

  async createRegistration(newEventType) {
    const _registration = _.pick(newEventType, [
      "email",
      "notified",
      "event_id",
    ]);
    const { rows } = await this.pool.query(
      `INSERT INTO registrations (email, notified, event_id) 
        VALUES ($1, $2, $3) RETURNING *`,
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
    console.log(_registration);

    let condition = "";

    condition = Object.entries(_registration).reduce((prev, curr, ind) => {
      let key = curr[0];
      let value = curr[1];
      if (value === undefined) return prev;
      let cond = prev;

      cond += ind === 0 || prev === "" ? "" : "AND ";
      cond += `${key}${key !== "email" ? "=" : " LIKE "}${
        key !== "email" ? "'" + value + "'" : "'%" + value + "%'"
      }`;

      console.log(curr, cond);
      return cond;
    }, "");
    console.log(
      "condition",
      `SELECT registrations.* FROM registrations WHERE ${condition}`
    );
    const { rows } = await this.pool.query(
      `SELECT registrations.* FROM registrations${
        condition ? " WHERE " : ""
      }${condition}`
    );
    return rows;
  }
};
