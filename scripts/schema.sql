CREATE TABLE bot_outputs (
    id INTEGER PRIMARY KEY ASC,
    type VARCHAR(32) NOT NULL,
    output text,
    repo_id integer,
    bot_name VARCHAR(255),
    repo_name VARCHAR(255),
    runtime_ms integer,
    "time" timestamp with time zone
);


CREATE TABLE bot_queue (
    id INTEGER PRIMARY KEY ASC,
    "time" timestamp with time zone,
    repo_id integer,
    repo_name VARCHAR(255),
    bot_name VARCHAR(255)
);


CREATE TABLE repos (
    id INTEGER PRIMARY KEY ASC,
    uuid TEXT NOT NULL,
    name text NOT NULL,
    dir text,
    repository text
);
