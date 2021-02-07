const _ = require("lodash");

module.exports = class EventTypeDbHandler {
  constructor(pool) {
    this.pool = pool;
  }

  async createEventType(newEventType) {
    const _eventType = _.pick(newEventType, ["name", "admin_id"]);
    const { rows } = await this.pool.query(
      `INSERT INTO event_types (name, admin_id) 
        VALUES ($1, $2) RETURNING *`,
      Object.values(_eventType)
    );
    const createdEventType = rows[0];
    return createdEventType;
  }

  async getEventTypes() {
    const { rows } = await this.pool.query(
      `SELECT event_types.* FROM event_types`
    );
    return rows;
  }

  async getEventType(id) {
    const {
      rows,
    } = await this.pool.query(
      `SELECT event_types.* FROM event_types WHERE event_types.id = $1`,
      [id]
    );
    return rows.length === 0 ? null : rows[0];
  }

  async deleteEventType(id) {
    await this.pool.query(
      `DELETE FROM event_types CASCADE
      WHERE id=${id}`
    );
    return id;
  }
};
