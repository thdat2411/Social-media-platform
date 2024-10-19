--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO root;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.customer (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    image_url character varying(255) NOT NULL
);


ALTER TABLE public.customer OWNER TO root;

--
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_id_seq OWNER TO root;

--
-- Name: customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.customer_id_seq OWNED BY public.customer.id;


--
-- Name: invoice; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.invoice (
    id integer NOT NULL,
    amount integer NOT NULL,
    status character varying(255) NOT NULL,
    date date NOT NULL,
    customer_id integer NOT NULL
);


ALTER TABLE public.invoice OWNER TO root;

--
-- Name: invoice_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.invoice_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoice_id_seq OWNER TO root;

--
-- Name: invoice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.invoice_id_seq OWNED BY public.invoice.id;


--
-- Name: revenue; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.revenue (
    month character varying(4) NOT NULL,
    revenue integer NOT NULL
);


ALTER TABLE public.revenue OWNER TO root;

--
-- Name: user; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public."user" OWNER TO root;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO root;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: customer id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.customer ALTER COLUMN id SET DEFAULT nextval('public.customer_id_seq'::regclass);


--
-- Name: invoice id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.invoice ALTER COLUMN id SET DEFAULT nextval('public.invoice_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
720cda91-e29a-4bf7-a7f9-01e6a80f4222	2a2a982e8b213def181b93cedebd76727959ef6fd931391cce49cbd38543970d	2024-10-17 14:54:23.618529+00	20241017145213_init	\N	\N	2024-10-17 14:54:23.595518+00	1
7b8de09a-0e0a-41d1-95fb-e50db333c324	d097e8778abb5bb5d9ef4b6224a28774b886e8893fb859b982200b0b153d2e9e	2024-10-17 16:43:32.905216+00	20241017164332_init	\N	\N	2024-10-17 16:43:32.867506+00	1
dde818e6-738b-48f2-bedd-cf7f22daf096	6a345592e7ad059493e70ae959af977b902dfb44be366e73f428b1458b3854fb	2024-10-17 17:08:37.959047+00	20241017170837_init	\N	\N	2024-10-17 17:08:37.929462+00	1
d1d9e317-8c0d-4d3a-9659-afaf2dff197d	ee3fda099749467c6bef9362ec97145cc0bc0470869d593033b5bafa4ceae52d	2024-10-17 17:53:05.519209+00	20241017175305_init	\N	\N	2024-10-17 17:53:05.485255+00	1
e2fc1846-9d41-4568-bfef-256dae031254	04fef727404e91404867c677c5d8fca7e0f319556506d5268164d832aa8de4ae	2024-10-17 17:54:00.779456+00	20241017175400_init	\N	\N	2024-10-17 17:54:00.758663+00	1
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.customer (id, name, email, image_url) FROM stdin;
1	Evil Rabbit	evil@rabbit.com	/customers/evil-rabbit.png
2	Delba de Oliveira	delba@oliveira.com	/customers/delba-de-oliveira.png
3	Lee Robinson	lee@robinson.com	/customers/lee-robinson.png
4	Michael Novotny	michael@novotny.com	/customers/michael-novotny.png
5	Amy Burns	amy@burns.com	/customers/amy-burns.png
6	Balazs Orban	balazs@orban.com	/customers/balazs-orban.png
\.


--
-- Data for Name: invoice; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.invoice (id, amount, status, date, customer_id) FROM stdin;
1	15795	pending	2022-12-06	1
2	666	pending	2023-06-27	1
3	20348	pending	2022-11-14	2
4	500	paid	2023-08-19	2
5	54246	pending	2023-07-16	3
6	1000	paid	2022-06-05	3
7	44800	paid	2023-09-10	4
8	32545	paid	2023-06-09	4
9	3040	paid	2022-10-29	5
10	1250	paid	2023-06-17	5
11	34577	pending	2023-08-05	6
12	8546	paid	2023-06-07	6
13	8945	paid	2023-06-03	6
\.


--
-- Data for Name: revenue; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.revenue (month, revenue) FROM stdin;
Jan	2000
Feb	1800
Mar	2200
Apr	2500
May	2300
Jun	3200
Jul	3500
Aug	3700
Sep	2500
Oct	2800
Nov	3000
Dec	4800
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."user" (id, name, email, password) FROM stdin;
1	User	user@nextmail.com	$2b$10$T7KcbQpc4fcBiqKa5miSgeLw.EiwA67V81CeIUOgzFg5BMj/gtQ1S
\.


--
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.customer_id_seq', 6, true);


--
-- Name: invoice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.invoice_id_seq', 13, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.user_id_seq', 1, true);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: invoice invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: revenue_month_key; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX revenue_month_key ON public.revenue USING btree (month);


--
-- Name: user_email_key; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);


--
-- Name: invoice invoice_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT invoice_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

