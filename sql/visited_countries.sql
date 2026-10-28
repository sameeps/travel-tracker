-- Table: public.visited_countries

-- DROP TABLE IF EXISTS public.visited_countries;

CREATE TABLE IF NOT EXISTS public.visited_countries
(
    id serial NOT NULL,
    country_code character(2) COLLATE pg_catalog."default" NOT NULL,
    user_id integer,
    CONSTRAINT visited_countries_pkey PRIMARY KEY (id),
    CONSTRAINT visited_countries_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.visited_countries
    OWNER to postgres;