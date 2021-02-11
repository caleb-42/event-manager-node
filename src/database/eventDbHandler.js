const { formatSpeakers, updateSpeakers } = require("../utils");
const _ = require("lodash");

module.exports = class EventDbHandler {
  constructor(pool) {
    this.pool = pool;
  }

  async searchEvent(val) {
    const { rows } = await this.pool.query(
      `SELECT events.id, events.name, events.description, events.location, events.start_date, events.end_date FROM events WHERE name LIKE '%${val}%' OR description LIKE '%${val}%'`
    );
    return rows;
  }

  async createEvent(newEvent) {
    const _event = _.pick(newEvent, [
      "admin_id",
      "name",
      "description",
      "location",
      "start_date",
      "end_date",
    ]);
    console.log(_event);
    _event.speakers = JSON.stringify([]);
    const { rows } = await this.pool.query(
      `INSERT INTO events (
        admin_id, name, description, location, start_date, end_date, speakers) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      Object.values(_event)
    );
    const createdEvent = rows[0];
    let event_types = await this.linkEventTypes(
      newEvent.event_types,
      createdEvent.id
    );
    return { ...createdEvent, event_types };
  }

  async updateEvent(id, newEvent, foundEvent) {
    console.log("foundEvent", foundEvent);
    const _event = {
      name: newEvent.name || foundEvent.name,
      description: newEvent.description || foundEvent.description,
      speakers: newEvent.speakers || foundEvent.speakers,
      location: newEvent.location || foundEvent.location,
      start_date: newEvent.start_date || foundEvent.start_date,
      end_date: newEvent.end_date || foundEvent.end_date,
    };

    if (newEvent.speakers) {
      _event.speakers = await updateSpeakers(_event.speakers);
    }
    const { rows } = await this.pool.query(
      `UPDATE events SET name=$1, description=$2, speakers=$3, location=$4, start_date=$5, end_date=$6
      WHERE id=${id} RETURNING *`,
      Object.values(_event)
    );
    const updatedEvent = rows[0];

    if (newEvent.event_types) {
      await this.unLinkEventTypes(updatedEvent.id);
      let event_types = await this.linkEventTypes(
        newEvent.event_types,
        updatedEvent.id
      );
      updatedEvent.event_type = event_types;
      // _event.speakers = await formatSpeakers(_event.speakers);
    }
    return updatedEvent;
  }

  async unLinkEventTypes(eventId) {
    const { rows } = await this.pool.query(
      `DELETE FROM events_event_types
      WHERE event_id=${eventId}`
    );

    const deletedEventEventTypes = rows;
    return deletedEventEventTypes;
  }

  async linkEventTypes(eventLinkType = [], eventId) {
    let prepSql = eventLinkType.reduce(
      (prev, item, ind) => {
        let keys = `${prev.keys}${
          ind === eventLinkType.length || ind == 0 ? "" : ", "
        }`;
        let values = prev.values;
        values.push(eventId);
        keys += `($${values.length}`;
        values.push(item);
        keys += `, $${values.length})`;
        return { keys, values };
      },
      { values: [], keys: "" }
    );
    console.log(prepSql);
    const { rows } = await this.pool.query(
      `INSERT INTO events_event_types (
        event_id, event_type_id) 
        VALUES ${prepSql.keys} RETURNING *`,
      prepSql.values
    );

    const createdEventEventTypes = rows;
    return createdEventEventTypes;
  }

  async getEvents() {
    const { rows } = await this.pool.query(
      /* SELECT row_to_json(u) as FROM (
        SELECT events.*,
          (
            SELECT array_to_json(array_agg(b)) from (
              SELECT event_types.*
              FROM event_types
              INNER JOIN events_event_types
              ON event_types.id = events_event_types.event_type_id
              WHERE events_event_types.event_id = events.id
            ) b
          ) AS event_types 
        FROM events
      ) u */
      `SELECT events.id, events.name, events.location, events.speakers, events.description, events.start_date, events.end_date,
      (
        SELECT array_to_json(array_agg(b)) from (
          SELECT event_types.id, event_types.name
          FROM event_types
          INNER JOIN events_event_types
          ON event_types.id = events_event_types.event_type_id
          WHERE events_event_types.event_id = events.id
        ) b
      ) AS event_types 
    FROM events`
    );
    return rows;
  }

  async getEvent(id) {
    const { rows } = await this.pool.query(
      `SELECT events.*,
      (
        SELECT array_to_json(array_agg(b)) from (
          SELECT event_types.*
          FROM event_types
          INNER JOIN events_event_types
          ON event_types.id = events_event_types.event_type_id
          WHERE events_event_types.event_id = events.id
        ) b
      ) AS event_types 
    FROM events WHERE events.id = $1`,
      [id]
    );
    return rows.length === 0 ? null : rows[0];
  }

  async deleteEvent(id) {
    await this.pool.query(
      `DELETE FROM events CASCADE
      WHERE id=${id}`
    );
    return id;
  }
};
