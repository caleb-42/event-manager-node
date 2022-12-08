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
  "name" varchar (255),
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

INSERT INTO admins (username, password)
	VALUES ('super-admin', '$2b$10$VgoKPkrEpZ6UMQOUKx5VEOIEMvoVOQP/6QrdQpSUnYeQDq9M4uSOK');

INSERT INTO event_types (name, admin_id)
	VALUES 
    ('MeetUp',1),
    ('Leap', 1),
    ('Recruiting Mission' ,1),
    ('Hackathon', 1),
    ('Premium-only Webinar', 1),
    ('Open Webinar', 1);

INSERT INTO events (admin_id,name,description,"location",speakers,start_date,end_date,created_at) VALUES
	 (1,'Beach Party','Party for every one. Come with friends and family','Zanziba','[{"name":"Jeff","desc":"CEO","pic":"/avatar.png"}]','2022-12-19 00:00:00','2022-12-22 00:00:00','2022-12-04 10:55:41.031681'),
	 (1,'Campaign','The presidential campaign going on in The country','Turin','[{"name":"Obama","desc":"US president","pic":"/avatar.png"},{"name":"Hillary Clinton","desc":"Politician","pic":"/avatar.png"}]','2022-12-20 00:00:00','2022-12-23 00:00:00','2022-12-05 20:39:42.347041'),
	 (1,'Seminar','Meeting of great minds to discuss the future of the civilisation','Paris','[{"name":"Elon Musk","desc":"Iron man","pic":"/avatar.png"},{"name":"Steve jobs","desc":"Innovator","pic":"/avatar.png"}]','2022-12-21 00:00:00','2022-12-23 00:00:00','2022-12-05 20:43:16.27917'),
	 (1,'Book club','Reading to broaden our minds','Winslow Library','[{"name":"Harry potter","desc":"Wizard","pic":"/avatar.png"},{"name":"Frodo Baggins","desc":"Hobbit","pic":"/avatar.png"}]','2023-01-04 00:00:00','2023-01-08 00:00:00','2022-12-05 20:52:49.278313');

INSERT INTO public.event_types (name,created_at,admin_id) VALUES
	 ('MeetUp','2022-12-04 07:41:02.346853',1),
	 ('Leap','2022-12-04 07:41:02.346853',1),
	 ('Recruiting Mission','2022-12-04 07:41:02.346853',1),
	 ('Hackathon','2022-12-04 07:41:02.346853',1),
	 ('Premium-only Webinar','2022-12-04 07:41:02.346853',1),
	 ('Open Webinar','2022-12-04 07:41:02.346853',1),
	 ('leisure','2022-12-04 21:19:57.200058',1);

INSERT INTO public.events_event_types (event_id,event_type_id) VALUES
	 (1,5),
	 (2,2),
	 (2,6),
	 (3,3),
	 (4,4);
