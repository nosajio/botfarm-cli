CREATE DATABASE botfarm;

\connect botfarm;

--
-- PostgreSQL database dump
--

-- Dumped from database version 10.0
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET search_path = public, pg_catalog;

--
-- Name: bots_runlog_seq; Type: SEQUENCE; Schema: public; Owner: pguser
--

CREATE SEQUENCE bots_runlog_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bots_runlog_seq OWNER TO pguser;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: bot_history; Type: TABLE; Schema: public; Owner: pguser
--

CREATE TABLE bot_history (
    id integer DEFAULT nextval('bots_runlog_seq'::regclass) NOT NULL,
    "time" timestamp with time zone,
    output_id integer,
    status character varying(32),
    bot_filename character varying(255),
    farm_id integer
);


ALTER TABLE bot_history OWNER TO pguser;

--
-- Name: bot_output_seq; Type: SEQUENCE; Schema: public; Owner: pguser
--

CREATE SEQUENCE bot_output_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bot_output_seq OWNER TO pguser;

--
-- Name: bot_outputs; Type: TABLE; Schema: public; Owner: pguser
--

CREATE TABLE bot_outputs (
    id integer DEFAULT nextval('bot_output_seq'::regclass) NOT NULL,
    type character varying(32) NOT NULL,
    output text,
    farm_id integer,
    bot_filename character varying(255)
);


ALTER TABLE bot_outputs OWNER TO pguser;

--
-- Name: queue_id_seq; Type: SEQUENCE; Schema: public; Owner: pguser
--

CREATE SEQUENCE queue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE queue_id_seq OWNER TO pguser;

--
-- Name: bot_queue; Type: TABLE; Schema: public; Owner: pguser
--

CREATE TABLE bot_queue (
    id integer DEFAULT nextval('queue_id_seq'::regclass) NOT NULL,
    filename character varying(255),
    "time" timestamp with time zone,
    farm_id integer
);


ALTER TABLE bot_queue OWNER TO pguser;

--
-- Name: bots_seq; Type: SEQUENCE; Schema: public; Owner: pguser
--

CREATE SEQUENCE bots_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE bots_seq OWNER TO pguser;

--
-- Name: farms_seq; Type: SEQUENCE; Schema: public; Owner: pguser
--

CREATE SEQUENCE farms_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE farms_seq OWNER TO pguser;

--
-- Name: farms; Type: TABLE; Schema: public; Owner: pguser
--

CREATE TABLE farms (
    id integer DEFAULT nextval('farms_seq'::regclass) NOT NULL,
    uuid uuid DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    slug text,
    repository text
);


ALTER TABLE farms OWNER TO pguser;

--
-- Name: COLUMN farms.slug; Type: COMMENT; Schema: public; Owner: pguser
--

COMMENT ON COLUMN farms.slug IS 'Should be the same as the name of the dir in userfiles';


--
-- Data for Name: bot_history; Type: TABLE DATA; Schema: public; Owner: pguser
--

COPY bot_history (id, "time", output_id, status, bot_filename, farm_id) FROM stdin;
\.


--
-- Data for Name: bot_outputs; Type: TABLE DATA; Schema: public; Owner: pguser
--

COPY bot_outputs (id, type, output, farm_id, bot_filename) FROM stdin;
\.


--
-- Data for Name: bot_queue; Type: TABLE DATA; Schema: public; Owner: pguser
--

COPY bot_queue (id, filename, "time", farm_id) FROM stdin;
\.


--
-- Data for Name: farms; Type: TABLE DATA; Schema: public; Owner: pguser
--

COPY farms (id, uuid, name, slug, repository) FROM stdin;
1	08d34485-bb5b-4c09-8253-54b87d090514	testbots	botfarm-test-bots	https://gitlab.com/nosaj/botfarm-test-bots
\.


--
-- Name: bot_output_seq; Type: SEQUENCE SET; Schema: public; Owner: pguser
--

SELECT pg_catalog.setval('bot_output_seq', 1, false);


--
-- Name: bots_runlog_seq; Type: SEQUENCE SET; Schema: public; Owner: pguser
--

SELECT pg_catalog.setval('bots_runlog_seq', 1, false);


--
-- Name: bots_seq; Type: SEQUENCE SET; Schema: public; Owner: pguser
--

SELECT pg_catalog.setval('bots_seq', 1, false);


--
-- Name: farms_seq; Type: SEQUENCE SET; Schema: public; Owner: pguser
--

SELECT pg_catalog.setval('farms_seq', 1, true);


--
-- Name: queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pguser
--

SELECT pg_catalog.setval('queue_id_seq', 1, false);


--
-- Name: bot_outputs bot_output_pkey; Type: CONSTRAINT; Schema: public; Owner: pguser
--

ALTER TABLE ONLY bot_outputs
    ADD CONSTRAINT bot_output_pkey PRIMARY KEY (id);


--
-- Name: bot_history bots_runlog_pkey; Type: CONSTRAINT; Schema: public; Owner: pguser
--

ALTER TABLE ONLY bot_history
    ADD CONSTRAINT bots_runlog_pkey PRIMARY KEY (id);


--
-- Name: farms farms_pkey; Type: CONSTRAINT; Schema: public; Owner: pguser
--

ALTER TABLE ONLY farms
    ADD CONSTRAINT farms_pkey PRIMARY KEY (id);


--
-- Name: farms farms_uuid_key; Type: CONSTRAINT; Schema: public; Owner: pguser
--

ALTER TABLE ONLY farms
    ADD CONSTRAINT farms_uuid_key UNIQUE (uuid);


--
-- Name: bot_queue queue_pkey; Type: CONSTRAINT; Schema: public; Owner: pguser
--

ALTER TABLE ONLY bot_queue
    ADD CONSTRAINT queue_pkey PRIMARY KEY (id);


--
-- Name: bot_history bot_history_farm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pguser
--

ALTER TABLE ONLY bot_history
    ADD CONSTRAINT bot_history_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE;


--
-- Name: bot_outputs bot_output_farm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pguser
--

ALTER TABLE ONLY bot_outputs
    ADD CONSTRAINT bot_output_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE;


--
-- Name: bot_queue bot_queue_farm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pguser
--

ALTER TABLE ONLY bot_queue
    ADD CONSTRAINT bot_queue_farm_id_fkey FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE;


--
-- Name: bot_history bots_runlog_output_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pguser
--

ALTER TABLE ONLY bot_history
    ADD CONSTRAINT bots_runlog_output_id_fkey FOREIGN KEY (output_id) REFERENCES bot_outputs(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

