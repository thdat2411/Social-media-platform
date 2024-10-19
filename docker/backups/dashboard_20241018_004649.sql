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
-- Name: Customer; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Customer" (
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    image_url character varying(255) NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."Customer" OWNER TO root;

--
-- Name: Customer_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Customer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Customer_id_seq" OWNER TO root;

--
-- Name: Customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."Customer_id_seq" OWNED BY public."Customer".id;


--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Invoice" (
    amount integer NOT NULL,
    status character varying(255) NOT NULL,
    date date NOT NULL,
    id integer NOT NULL,
    customer_id integer NOT NULL
);


ALTER TABLE public."Invoice" OWNER TO root;

--
-- Name: Invoice_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Invoice_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Invoice_id_seq" OWNER TO root;

--
-- Name: Invoice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."Invoice_id_seq" OWNED BY public."Invoice".id;


--
-- Name: Revenue; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Revenue" (
    month character varying(4) NOT NULL,
    revenue integer NOT NULL
);


ALTER TABLE public."Revenue" OWNER TO root;

--
-- Name: User; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."User" (
    name character varying(255) NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."User" OWNER TO root;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO root;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


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
-- Name: Customer id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Customer" ALTER COLUMN id SET DEFAULT nextval('public."Customer_id_seq"'::regclass);


--
-- Name: Invoice id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Invoice" ALTER COLUMN id SET DEFAULT nextval('public."Invoice_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Customer" (name, email, image_url, id) FROM stdin;
Evil Rabbit	evil@rabbit.com	/customers/evil-rabbit.png	1
Delba de Oliveira	delba@oliveira.com	/customers/delba-de-oliveira.png	2
Lee Robinson	lee@robinson.com	/customers/lee-robinson.png	3
Michael Novotny	michael@novotny.com	/customers/michael-novotny.png	4
Amy Burns	amy@burns.com	/customers/amy-burns.png	5
Balazs Orban	balazs@orban.com	/customers/balazs-orban.png	6
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Invoice" (amount, status, date, id, customer_id) FROM stdin;
15795	pending	2022-12-06	1	1
666	pending	2023-06-27	2	1
20348	pending	2022-11-14	3	2
500	paid	2023-08-19	4	2
54246	pending	2023-07-16	5	3
1000	paid	2022-06-05	6	3
44800	paid	2023-09-10	7	4
32545	paid	2023-06-09	8	4
3040	paid	2022-10-29	9	5
1250	paid	2023-06-17	10	5
34577	pending	2023-08-05	11	6
8546	paid	2023-06-07	12	6
8945	paid	2023-06-03	13	6
\.


--
-- Data for Name: Revenue; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."Revenue" (month, revenue) FROM stdin;
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
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public."User" (name, email, password, id) FROM stdin;
User	user@nextmail.com	$2b$10$aCyeL/eX4cQeghX4FEf2k.TU07YhASqkfe/K6VDFt9p5Pxep/h3G.	1
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
720cda91-e29a-4bf7-a7f9-01e6a80f4222	2a2a982e8b213def181b93cedebd76727959ef6fd931391cce49cbd38543970d	2024-10-17 14:54:23.618529+00	20241017145213_init	\N	\N	2024-10-17 14:54:23.595518+00	1
7b8de09a-0e0a-41d1-95fb-e50db333c324	d097e8778abb5bb5d9ef4b6224a28774b886e8893fb859b982200b0b153d2e9e	2024-10-17 16:43:32.905216+00	20241017164332_init	\N	\N	2024-10-17 16:43:32.867506+00	1
dde818e6-738b-48f2-bedd-cf7f22daf096	6a345592e7ad059493e70ae959af977b902dfb44be366e73f428b1458b3854fb	2024-10-17 17:08:37.959047+00	20241017170837_init	\N	\N	2024-10-17 17:08:37.929462+00	1
\.


--
-- Name: Customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Customer_id_seq"', 6, true);


--
-- Name: Invoice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Invoice_id_seq"', 13, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."User_id_seq"', 3, true);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Revenue_month_key; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "Revenue_month_key" ON public."Revenue" USING btree (month);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Invoice Invoice_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

