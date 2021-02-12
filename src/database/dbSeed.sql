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