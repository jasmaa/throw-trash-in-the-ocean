
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL UNIQUE,
    pollution_level INTEGER,
    total_pollution INTEGER,
    is_dead BOOLEAN,
    created_timestamp TIMESTAMP WITHOUT TIME ZONE,
    destroyed_timestamp TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    room_id INTEGER NOT NULL,
    profit INTEGER,
    power_click_level INTEGER,
    estate_level INTEGER
);

CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    user_handle VARCHAR(255) NOT NULL
);

CREATE TYPE room_event AS ENUM ('join', 'leave', 'pollute', 'chat');
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    user_id VARCHAR(255),
    content VARCHAR(255),
    event_type room_event,
    event_timestamp TIMESTAMP WITHOUT TIME ZONE
);

INSERT INTO rooms (room_name, pollution_level, total_pollution, is_dead, created_timestamp, destroyed_timestamp)
VALUES ('dead', 0, 300, TRUE, NOW()::timestamp, NOW()::timestamp)