CREATE TABLE bot_outputs (
    id INTEGER PRIMARY KEY ASC,
    type VARCHAR(32) NOT NULL,
    output text,
    repo_id integer,
    bot_name VARCHAR(255),
    "time" timestamp with time zone,    
);


CREATE TABLE bot_queue (
    id INTEGER PRIMARY KEY ASC,
    "time" timestamp with time zone,
    repo_id integer,
    bot_name VARCHAR(255)
);


CREATE TABLE repos (
    id INTEGER PRIMARY KEY ASC,
    uuid TEXT NOT NULL,
    name text NOT NULL,
    dir text,
    repository text
);

-- Default data
-- INSERT INTO repos (uuid, name, dir, repository) VALUES ("08d34485-bb5b-4c09-8253-54b87d090514", "testbots", "botrepo-test-bots", "https://gitlab.com/nosaj/botrepo-test-bots");
