-- Table: public.countries

-- DROP TABLE IF EXISTS public.countries;

CREATE TABLE IF NOT EXISTS public.countries
(
    id serial NOT NULL,
    country_code character(2) COLLATE pg_catalog."default",
    country_name character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT countries_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.countries
    OWNER to postgres;