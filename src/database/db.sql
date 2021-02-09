CREATE TABLE "admins" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar (255),
  "created_at" timestamp DEFAULT (now()),
  "password" varchar (255)
);

CREATE TABLE "events_event_types" (
  "id" SERIAL,
  "event_id" int,
  "event_type_id" int,
  PRIMARY KEY ("id", "event_id", "event_type_id")
);

CREATE TABLE "event_types" (
  "id" SERIAL UNIQUE,
  "name" varchar (255) UNIQUE,
  "created_at" timestamp DEFAULT (now()),
  "admin_id" int,
  PRIMARY KEY ("id", "name")
);

CREATE TABLE "registrations" (
  "id" SERIAL,
  "email" varchar (255),
  "notified" boolean,
  "event_id" int,
  "created_at" timestamp DEFAULT (now()),
  PRIMARY KEY ("id", "email", "event_id")
);

CREATE TABLE "events" (
  "id" SERIAL PRIMARY KEY,
  "admin_id" int,
  "name" varchar (255),
  "description" text,
  "location" text,
  "speakers" text,
  "start_date" timestamp,
  "end_date" timestamp,
  "created_at" timestamp DEFAULT (now())
);

ALTER TABLE "events_event_types" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE;

ALTER TABLE "events_event_types" ADD FOREIGN KEY ("event_type_id") REFERENCES "event_types" ("id") ON DELETE CASCADE;

ALTER TABLE "event_types" ADD FOREIGN KEY ("admin_id") REFERENCES "admins" ("id") ON DELETE CASCADE;

ALTER TABLE "registrations" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE;

ALTER TABLE "events" ADD FOREIGN KEY ("admin_id") REFERENCES "admins" ("id") ON DELETE CASCADE;

