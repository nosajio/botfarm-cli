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
-- Name: farms_seq; Type: SEQUENCE; Schema: public; Owner: pguser
--

CREATE SEQUENCE farms_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE farms_seq OWNER TO pguser;

SET default_tablespace = '';

SET default_with_oids = false;

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
-- Some seed data for dev only
--

COPY farms (id, uuid, name, slug, repository) FROM stdin;
1	08d34485-bb5b-4c09-8253-54b87d090514	testbots	botfarm-test-bots	https://gitlab.com/nosaj/botfarm-test-bots
\.


--
-- Name: farms_seq; Type: SEQUENCE SET; Schema: public; Owner: pguser
--

SELECT pg_catalog.setval('farms_seq', 1, true);


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
-- PostgreSQL database dump complete
--

