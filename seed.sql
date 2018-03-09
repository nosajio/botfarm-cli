

CREATE TABLE bot_history (
    id INTEGER PRIMARY KEY ASC,
    "time" timestamp with time zone,
    output_id integer,
    status VARCHAR(32),
    bot_name VARCHAR(255),
    farm_id integer,
    bot_filename VARCHAR(255)
);


CREATE TABLE bot_outputs (
    id INTEGER PRIMARY KEY ASC,
    type VARCHAR(32) NOT NULL,
    output text,
    farm_id integer,
    bot_name VARCHAR(255)
);


CREATE TABLE bot_queue (
    id INTEGER PRIMARY KEY ASC,
    "time" timestamp with time zone,
    farm_id integer,
    bot_name VARCHAR(255)
);


CREATE TABLE farms (
    id INTEGER PRIMARY KEY ASC,
    uuid TEXT NOT NULL,
    name text NOT NULL,
    slug text,
    repository text
);

-- INSERT INTO farms (uuid, name, slug, repository) VALUES ("08d34485-bb5b-4c09-8253-54b87d090514", "testbots", "botfarm-test-bots", "https://gitlab.com/nosaj/botfarm-test-bots");
