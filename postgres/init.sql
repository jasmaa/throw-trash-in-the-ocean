
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL UNIQUE,
    pollution_level INTEGER,
    is_dead BOOLEAN
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
    event_type room_event,
    event_description VARCHAR(255) NOT NULL,
    event_timestamp TIMESTAMP WITH TIME ZONE
);