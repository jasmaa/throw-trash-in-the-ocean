
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL UNIQUE,
    pollution_level INTEGER,
    is_dead BOOLEAN
);

CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    profit INTEGER
);

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY,
    user_handle VARCHAR(255) NOT NULL UNIQUE
);