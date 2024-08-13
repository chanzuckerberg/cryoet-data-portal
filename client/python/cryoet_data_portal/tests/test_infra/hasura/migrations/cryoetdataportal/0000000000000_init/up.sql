--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2 (Debian 14.2-1.pgdg110+1)
-- Dumped by pg_dump version 14.13 (Homebrew)

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

-- ALTER TABLE IF EXISTS ONLY public.tomograms DROP CONSTRAINT IF EXISTS tomograms_type_fkey;
-- ALTER TABLE IF EXISTS ONLY public.tomograms DROP CONSTRAINT IF EXISTS tomograms_tomogram_voxel_spacing_id_fkey;
-- ALTER TABLE IF EXISTS ONLY public.tomogram_voxel_spacings DROP CONSTRAINT IF EXISTS tomogram_voxel_spacing_run_id_fkey;
-- ALTER TABLE IF EXISTS ONLY public.tomogram_authors DROP CONSTRAINT IF EXISTS tomogram_authors_tomogram_id_fkey;
-- ALTER TABLE IF EXISTS ONLY public.tiltseries DROP CONSTRAINT IF EXISTS tiltseries_run_id_fkey;
-- ALTER TABLE IF EXISTS ONLY public.runs DROP CONSTRAINT IF EXISTS runs_dataset_id_fkey;
-- ALTER TABLE IF EXISTS ONLY public.deposition_authors DROP CONSTRAINT IF EXISTS deposition_authors_deposition_id_fkey;
-- ALTER TABLE IF EXISTS ONLY public.dataset_funding DROP CONSTRAINT IF EXISTS dataset_funding_dataset_id_fkey;
-- ALTER TABLE IF EXISTS ONLY public.dataset_authors DROP CONSTRAINT IF EXISTS dataset_authors_dataset_id_fkey;
-- ALTER TABLE IF EXISTS ONLY public.annotations DROP CONSTRAINT IF EXISTS annotations_tomogram_voxel_spacing_id_fkey;
-- ALTER TABLE IF EXISTS ONLY public.annotation_files DROP CONSTRAINT IF EXISTS annotation_files_annotation_id_fkey;
-- ALTER TABLE IF EXISTS ONLY public.annotation_authors DROP CONSTRAINT IF EXISTS annotation_authors_annotation_id_fkey;
-- DROP INDEX IF EXISTS public.tomograms_tomogram_voxel_spacing_id;
-- DROP INDEX IF EXISTS public.tomograms_deposition_id;
-- DROP INDEX IF EXISTS public.tomogram_voxel_spacing_run;
-- DROP INDEX IF EXISTS public.tiltseries_run;
-- DROP INDEX IF EXISTS public.tiltseries_deposition_id;
-- DROP INDEX IF EXISTS public.depositions_type;
-- DROP INDEX IF EXISTS public.dataset_funding_dataset;
-- DROP INDEX IF EXISTS public.dataset_deposition_id;
-- DROP INDEX IF EXISTS public.dataset_authors_dataset;
-- DROP INDEX IF EXISTS public.annotations_tomogram_voxel_spacing;
-- DROP INDEX IF EXISTS public.annotations_deposition_id;
-- DROP INDEX IF EXISTS public.annotation_method;
-- DROP INDEX IF EXISTS public.annotation_files_annotation_id;
-- ALTER TABLE IF EXISTS ONLY public.tomograms DROP CONSTRAINT IF EXISTS tomograms_pkey;
-- ALTER TABLE IF EXISTS ONLY public.tomogram_voxel_spacings DROP CONSTRAINT IF EXISTS tomogram_voxel_spacing_pkey;
-- ALTER TABLE IF EXISTS ONLY public.tomogram_type DROP CONSTRAINT IF EXISTS tomogram_type_pkey;
-- ALTER TABLE IF EXISTS ONLY public.tomogram_authors DROP CONSTRAINT IF EXISTS tomogram_authors_tomogram_id_name_key;
-- ALTER TABLE IF EXISTS ONLY public.tomogram_authors DROP CONSTRAINT IF EXISTS tomogram_authors_pkey;
-- ALTER TABLE IF EXISTS ONLY public.tiltseries DROP CONSTRAINT IF EXISTS tiltseries_pkey;
-- ALTER TABLE IF EXISTS ONLY public.runs DROP CONSTRAINT IF EXISTS runs_pkey;
-- ALTER TABLE IF EXISTS ONLY public.runs DROP CONSTRAINT IF EXISTS runs_dataset_id_name_key;
-- ALTER TABLE IF EXISTS ONLY public.depositions DROP CONSTRAINT IF EXISTS depositions_pkey;
-- ALTER TABLE IF EXISTS ONLY public.deposition_authors DROP CONSTRAINT IF EXISTS deposition_authors_pkey;
-- ALTER TABLE IF EXISTS ONLY public.datasets DROP CONSTRAINT IF EXISTS datasets_pkey;
-- ALTER TABLE IF EXISTS ONLY public.dataset_funding DROP CONSTRAINT IF EXISTS dataset_funding_pkey;
-- ALTER TABLE IF EXISTS ONLY public.dataset_authors DROP CONSTRAINT IF EXISTS dataset_authors_pkey;
-- ALTER TABLE IF EXISTS ONLY public.annotations DROP CONSTRAINT IF EXISTS annotations_pkey;
-- ALTER TABLE IF EXISTS ONLY public.annotation_files DROP CONSTRAINT IF EXISTS annotation_files_shape_type_annotation_id_format_key;
-- ALTER TABLE IF EXISTS ONLY public.annotation_files DROP CONSTRAINT IF EXISTS annotation_files_pkey;
-- ALTER TABLE IF EXISTS ONLY public.annotation_authors DROP CONSTRAINT IF EXISTS annotation_authors_pkey;
-- ALTER TABLE IF EXISTS ONLY public.annotation_authors DROP CONSTRAINT IF EXISTS annotation_authors_annotation_id_name_key;
-- ALTER TABLE IF EXISTS public.tomograms ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE IF EXISTS public.tomogram_voxel_spacings ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE IF EXISTS public.tomogram_authors ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE IF EXISTS public.tiltseries ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE IF EXISTS public.runs ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE IF EXISTS public.depositions ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE IF EXISTS public.deposition_authors ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE IF EXISTS public.dataset_funding ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE IF EXISTS public.dataset_authors ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE IF EXISTS public.annotations ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE IF EXISTS public.annotation_files ALTER COLUMN id DROP DEFAULT;
-- ALTER TABLE IF EXISTS public.annotation_authors ALTER COLUMN id DROP DEFAULT;
-- DROP SEQUENCE IF EXISTS public.tomograms_id_seq;
-- DROP TABLE IF EXISTS public.tomograms;
-- DROP SEQUENCE IF EXISTS public.tomogram_voxel_spacing_id_seq;
-- DROP TABLE IF EXISTS public.tomogram_voxel_spacings;
-- DROP TABLE IF EXISTS public.tomogram_type;
-- DROP SEQUENCE IF EXISTS public.tomogram_authors_id_seq;
-- DROP TABLE IF EXISTS public.tomogram_authors;
-- DROP SEQUENCE IF EXISTS public.tiltseries_id_seq;
-- DROP TABLE IF EXISTS public.tiltseries;
-- DROP SEQUENCE IF EXISTS public.runs_id_seq;
-- DROP TABLE IF EXISTS public.runs;
-- DROP SEQUENCE IF EXISTS public.depositions_id_seq;
-- DROP TABLE IF EXISTS public.depositions;
-- DROP SEQUENCE IF EXISTS public.deposition_authors_id_seq;
-- DROP TABLE IF EXISTS public.deposition_authors;
-- DROP TABLE IF EXISTS public.datasets;
-- DROP SEQUENCE IF EXISTS public.dataset_funding_id_seq;
-- DROP TABLE IF EXISTS public.dataset_funding;
-- DROP SEQUENCE IF EXISTS public.dataset_authors_id_seq;
-- DROP TABLE IF EXISTS public.dataset_authors;
-- DROP SEQUENCE IF EXISTS public.annotations_id_seq;
-- DROP TABLE IF EXISTS public.annotations;
-- DROP SEQUENCE IF EXISTS public.annotation_files_id_seq;
-- DROP TABLE IF EXISTS public.annotation_files;
-- DROP SEQUENCE IF EXISTS public.annotation_authors_id_seq;
-- DROP TABLE IF EXISTS public.annotation_authors;
-- DROP SCHEMA IF EXISTS public;
-- --
-- -- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
-- --

-- CREATE SCHEMA public;


-- ALTER SCHEMA public OWNER TO postgres;

-- SET default_tablespace = '';

-- SET default_table_access_method = heap;

--
-- Name: annotation_authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.annotation_authors (
    id integer NOT NULL,
    annotation_id integer NOT NULL,
    name character varying NOT NULL,
    orcid character varying,
    corresponding_author_status boolean,
    primary_annotator_status boolean,
    email character varying,
    affiliation_name character varying,
    affiliation_address character varying,
    affiliation_identifier character varying,
    author_list_order integer,
    primary_author_status boolean
);


-- ALTER TABLE public.annotation_authors OWNER TO postgres;

--
-- Name: annotation_authors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.annotation_authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.annotation_authors_id_seq OWNER TO postgres;

--
-- Name: annotation_authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.annotation_authors_id_seq OWNED BY public.annotation_authors.id;


--
-- Name: annotation_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.annotation_files (
    id integer NOT NULL,
    annotation_id integer NOT NULL,
    shape_type character varying NOT NULL,
    format character varying NOT NULL,
    https_path character varying NOT NULL,
    s3_path character varying NOT NULL,
    is_visualization_default boolean DEFAULT false
);


-- ALTER TABLE public.annotation_files OWNER TO postgres;

--
-- Name: annotation_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.annotation_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.annotation_files_id_seq OWNER TO postgres;

--
-- Name: annotation_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.annotation_files_id_seq OWNED BY public.annotation_files.id;


--
-- Name: annotations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.annotations (
    id integer NOT NULL,
    s3_metadata_path character varying NOT NULL,
    https_metadata_path character varying NOT NULL,
    deposition_date date NOT NULL,
    release_date date NOT NULL,
    last_modified_date date,
    annotation_publication character varying,
    annotation_method character varying NOT NULL,
    ground_truth_status boolean NOT NULL,
    object_name character varying NOT NULL,
    object_id character varying NOT NULL,
    object_description character varying,
    object_state character varying,
    object_count integer NOT NULL,
    confidence_precision numeric,
    confidence_recall numeric,
    ground_truth_used character varying,
    tomogram_voxel_spacing_id integer,
    annotation_software character varying,
    is_curator_recommended boolean DEFAULT false,
    method_type character varying,
    deposition_id integer,
    method_links json
);


-- ALTER TABLE public.annotations OWNER TO postgres;

--
-- Name: annotations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.annotations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.annotations_id_seq OWNER TO postgres;

--
-- Name: annotations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.annotations_id_seq OWNED BY public.annotations.id;


--
-- Name: dataset_authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dataset_authors (
    id integer NOT NULL,
    name character varying NOT NULL,
    orcid character varying,
    corresponding_author_status boolean,
    email character varying,
    affiliation_name character varying,
    affiliation_address character varying,
    affiliation_identifier character varying,
    dataset_id integer NOT NULL,
    primary_author_status boolean,
    author_list_order integer
);


-- ALTER TABLE public.dataset_authors OWNER TO postgres;

--
-- Name: dataset_authors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dataset_authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.dataset_authors_id_seq OWNER TO postgres;

--
-- Name: dataset_authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dataset_authors_id_seq OWNED BY public.dataset_authors.id;


--
-- Name: dataset_funding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dataset_funding (
    id integer NOT NULL,
    dataset_id integer NOT NULL,
    funding_agency_name character varying NOT NULL,
    grant_id character varying
);


-- ALTER TABLE public.dataset_funding OWNER TO postgres;

--
-- Name: dataset_funding_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dataset_funding_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.dataset_funding_id_seq OWNER TO postgres;

--
-- Name: dataset_funding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dataset_funding_id_seq OWNED BY public.dataset_funding.id;


--
-- Name: datasets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.datasets (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    deposition_date date NOT NULL,
    release_date date NOT NULL,
    last_modified_date date,
    related_database_entries character varying,
    related_database_links character varying,
    dataset_publications character varying,
    dataset_citations character varying,
    sample_type character varying NOT NULL,
    organism_name character varying,
    organism_taxid character varying,
    tissue_name character varying,
    tissue_id character varying,
    cell_name character varying,
    cell_type_id character varying,
    cell_strain_name character varying,
    cell_strain_id character varying,
    sample_preparation character varying,
    grid_preparation character varying,
    other_setup character varying,
    s3_prefix character varying NOT NULL,
    https_prefix character varying NOT NULL,
    key_photo_url character varying,
    key_photo_thumbnail_url character varying,
    cell_component_name character varying,
    cell_component_id character varying,
    deposition_id integer
);


-- ALTER TABLE public.datasets OWNER TO postgres;

--
-- Name: deposition_authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.deposition_authors (
    id integer NOT NULL,
    name character varying NOT NULL,
    orcid character varying,
    corresponding_author_status boolean DEFAULT false,
    email character varying,
    affiliation_name character varying,
    affiliation_address character varying,
    affiliation_identifier character varying,
    deposition_id integer NOT NULL,
    primary_author_status boolean DEFAULT false,
    author_list_order integer NOT NULL
);


-- ALTER TABLE public.deposition_authors OWNER TO postgres;

--
-- Name: deposition_authors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.deposition_authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.deposition_authors_id_seq OWNER TO postgres;

--
-- Name: deposition_authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.deposition_authors_id_seq OWNED BY public.deposition_authors.id;


--
-- Name: depositions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.depositions (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    deposition_date date NOT NULL,
    release_date date NOT NULL,
    last_modified_date date NOT NULL,
    related_database_entries character varying,
    deposition_publications character varying,
    deposition_types character varying NOT NULL,
    s3_prefix character varying,
    https_prefix character varying,
    key_photo_url character varying,
    key_photo_thumbnail_url character varying
);


-- ALTER TABLE public.depositions OWNER TO postgres;

--
-- Name: depositions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.depositions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.depositions_id_seq OWNER TO postgres;

--
-- Name: depositions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.depositions_id_seq OWNED BY public.depositions.id;


--
-- Name: runs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.runs (
    id integer NOT NULL,
    dataset_id integer NOT NULL,
    name character varying NOT NULL,
    s3_prefix character varying NOT NULL,
    https_prefix character varying NOT NULL
);


-- ALTER TABLE public.runs OWNER TO postgres;

--
-- Name: runs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.runs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.runs_id_seq OWNER TO postgres;

--
-- Name: runs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.runs_id_seq OWNED BY public.runs.id;


--
-- Name: tiltseries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tiltseries (
    id integer NOT NULL,
    run_id integer NOT NULL,
    s3_mrc_bin1 character varying NOT NULL,
    s3_omezarr_dir character varying NOT NULL,
    https_mrc_bin1 character varying NOT NULL,
    https_omezarr_dir character varying NOT NULL,
    s3_collection_metadata character varying,
    https_collection_metadata character varying,
    s3_angle_list character varying,
    https_angle_list character varying,
    s3_alignment_file character varying,
    https_alignment_file character varying,
    acceleration_voltage integer NOT NULL,
    spherical_aberration_constant numeric NOT NULL,
    microscope_manufacturer character varying NOT NULL,
    microscope_model character varying NOT NULL,
    microscope_energy_filter character varying NOT NULL,
    microscope_phase_plate character varying,
    microscope_image_corrector character varying,
    microscope_additional_info character varying,
    camera_manufacturer character varying NOT NULL,
    camera_model character varying NOT NULL,
    tilt_min numeric NOT NULL,
    tilt_max numeric NOT NULL,
    tilt_range numeric NOT NULL,
    tilt_step numeric NOT NULL,
    tilting_scheme character varying NOT NULL,
    tilt_axis numeric NOT NULL,
    total_flux numeric NOT NULL,
    data_acquisition_software character varying NOT NULL,
    related_empiar_entry character varying,
    binning_from_frames numeric,
    tilt_series_quality integer NOT NULL,
    is_aligned boolean DEFAULT false NOT NULL,
    pixel_spacing numeric,
    aligned_tiltseries_binning integer,
    frames_count integer DEFAULT 0,
    deposition_id integer
);


-- ALTER TABLE public.tiltseries OWNER TO postgres;

--
-- Name: tiltseries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tiltseries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.tiltseries_id_seq OWNER TO postgres;

--
-- Name: tiltseries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tiltseries_id_seq OWNED BY public.tiltseries.id;


--
-- Name: tomogram_authors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tomogram_authors (
    id integer NOT NULL,
    tomogram_id integer NOT NULL,
    author_list_order integer NOT NULL,
    name character varying NOT NULL,
    orcid character varying,
    corresponding_author_status boolean,
    primary_author_status boolean,
    email character varying,
    affiliation_name character varying,
    affiliation_address character varying,
    affiliation_identifier character varying
);


-- ALTER TABLE public.tomogram_authors OWNER TO postgres;

--
-- Name: tomogram_authors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tomogram_authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.tomogram_authors_id_seq OWNER TO postgres;

--
-- Name: tomogram_authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tomogram_authors_id_seq OWNED BY public.tomogram_authors.id;


--
-- Name: tomogram_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tomogram_type (
    value text NOT NULL,
    description text
);


-- ALTER TABLE public.tomogram_type OWNER TO postgres;

--
-- Name: tomogram_voxel_spacings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tomogram_voxel_spacings (
    id integer NOT NULL,
    run_id integer NOT NULL,
    voxel_spacing numeric NOT NULL,
    s3_prefix character varying,
    https_prefix character varying
);


-- ALTER TABLE public.tomogram_voxel_spacings OWNER TO postgres;

--
-- Name: tomogram_voxel_spacing_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tomogram_voxel_spacing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.tomogram_voxel_spacing_id_seq OWNER TO postgres;

--
-- Name: tomogram_voxel_spacing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tomogram_voxel_spacing_id_seq OWNED BY public.tomogram_voxel_spacings.id;


--
-- Name: tomograms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tomograms (
    id integer NOT NULL,
    name character varying NOT NULL,
    size_x integer NOT NULL,
    size_y integer NOT NULL,
    size_z integer NOT NULL,
    voxel_spacing numeric NOT NULL,
    fiducial_alignment_status character varying NOT NULL,
    reconstruction_method character varying NOT NULL,
    reconstruction_software character varying NOT NULL,
    processing character varying NOT NULL,
    processing_software character varying,
    tomogram_version character varying NOT NULL,
    is_canonical boolean,
    s3_omezarr_dir character varying NOT NULL,
    https_omezarr_dir character varying NOT NULL,
    s3_mrc_scale0 character varying NOT NULL,
    https_mrc_scale0 character varying NOT NULL,
    scale0_dimensions character varying NOT NULL,
    scale1_dimensions character varying NOT NULL,
    scale2_dimensions character varying NOT NULL,
    ctf_corrected boolean,
    tomogram_voxel_spacing_id integer,
    offset_x integer DEFAULT 0 NOT NULL,
    offset_y integer DEFAULT 0 NOT NULL,
    offset_z integer DEFAULT 0 NOT NULL,
    affine_transformation_matrix numeric[],
    key_photo_url character varying,
    key_photo_thumbnail_url character varying,
    neuroglancer_config character varying,
    type text,
    deposition_id integer
);


-- ALTER TABLE public.tomograms OWNER TO postgres;

--
-- Name: tomograms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tomograms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public.tomograms_id_seq OWNER TO postgres;

--
-- Name: tomograms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tomograms_id_seq OWNED BY public.tomograms.id;


--
-- Name: annotation_authors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotation_authors ALTER COLUMN id SET DEFAULT nextval('public.annotation_authors_id_seq'::regclass);


--
-- Name: annotation_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotation_files ALTER COLUMN id SET DEFAULT nextval('public.annotation_files_id_seq'::regclass);


--
-- Name: annotations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotations ALTER COLUMN id SET DEFAULT nextval('public.annotations_id_seq'::regclass);


--
-- Name: dataset_authors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dataset_authors ALTER COLUMN id SET DEFAULT nextval('public.dataset_authors_id_seq'::regclass);


--
-- Name: dataset_funding id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dataset_funding ALTER COLUMN id SET DEFAULT nextval('public.dataset_funding_id_seq'::regclass);


--
-- Name: deposition_authors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deposition_authors ALTER COLUMN id SET DEFAULT nextval('public.deposition_authors_id_seq'::regclass);


--
-- Name: depositions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.depositions ALTER COLUMN id SET DEFAULT nextval('public.depositions_id_seq'::regclass);


--
-- Name: runs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.runs ALTER COLUMN id SET DEFAULT nextval('public.runs_id_seq'::regclass);


--
-- Name: tiltseries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiltseries ALTER COLUMN id SET DEFAULT nextval('public.tiltseries_id_seq'::regclass);


--
-- Name: tomogram_authors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomogram_authors ALTER COLUMN id SET DEFAULT nextval('public.tomogram_authors_id_seq'::regclass);


--
-- Name: tomogram_voxel_spacings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomogram_voxel_spacings ALTER COLUMN id SET DEFAULT nextval('public.tomogram_voxel_spacing_id_seq'::regclass);


--
-- Name: tomograms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomograms ALTER COLUMN id SET DEFAULT nextval('public.tomograms_id_seq'::regclass);


-- --
-- -- Name: annotation_authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.annotation_authors_id_seq', 115, true);


-- --
-- -- Name: annotation_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.annotation_files_id_seq', 17, true);


-- --
-- -- Name: annotations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.annotations_id_seq', 9, true);


-- --
-- -- Name: dataset_authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.dataset_authors_id_seq', 17, true);


-- --
-- -- Name: dataset_funding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.dataset_funding_id_seq', 4, true);


-- --
-- -- Name: deposition_authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.deposition_authors_id_seq', 70, true);


-- --
-- -- Name: depositions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.depositions_id_seq', 1, false);


-- --
-- -- Name: runs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.runs_id_seq', 5, true);


-- --
-- -- Name: tiltseries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.tiltseries_id_seq', 3, true);


-- --
-- -- Name: tomogram_authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.tomogram_authors_id_seq', 16, true);


-- --
-- -- Name: tomogram_voxel_spacing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.tomogram_voxel_spacing_id_seq', 4, true);


-- --
-- -- Name: tomograms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
-- --

-- SELECT pg_catalog.setval('public.tomograms_id_seq', 3, true);


--
-- Name: annotation_authors annotation_authors_annotation_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotation_authors
    ADD CONSTRAINT annotation_authors_annotation_id_name_key UNIQUE (annotation_id, name);


--
-- Name: annotation_authors annotation_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotation_authors
    ADD CONSTRAINT annotation_authors_pkey PRIMARY KEY (id);


--
-- Name: annotation_files annotation_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotation_files
    ADD CONSTRAINT annotation_files_pkey PRIMARY KEY (id);


--
-- Name: annotation_files annotation_files_shape_type_annotation_id_format_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotation_files
    ADD CONSTRAINT annotation_files_shape_type_annotation_id_format_key UNIQUE (shape_type, annotation_id, format);


--
-- Name: annotations annotations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotations
    ADD CONSTRAINT annotations_pkey PRIMARY KEY (id);


--
-- Name: dataset_authors dataset_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dataset_authors
    ADD CONSTRAINT dataset_authors_pkey PRIMARY KEY (id);


--
-- Name: dataset_funding dataset_funding_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dataset_funding
    ADD CONSTRAINT dataset_funding_pkey PRIMARY KEY (id);


--
-- Name: datasets datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.datasets
    ADD CONSTRAINT datasets_pkey PRIMARY KEY (id);


--
-- Name: deposition_authors deposition_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deposition_authors
    ADD CONSTRAINT deposition_authors_pkey PRIMARY KEY (id);


--
-- Name: depositions depositions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.depositions
    ADD CONSTRAINT depositions_pkey PRIMARY KEY (id);


--
-- Name: runs runs_dataset_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.runs
    ADD CONSTRAINT runs_dataset_id_name_key UNIQUE (dataset_id, name);


--
-- Name: runs runs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.runs
    ADD CONSTRAINT runs_pkey PRIMARY KEY (id);


--
-- Name: tiltseries tiltseries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiltseries
    ADD CONSTRAINT tiltseries_pkey PRIMARY KEY (id);


--
-- Name: tomogram_authors tomogram_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomogram_authors
    ADD CONSTRAINT tomogram_authors_pkey PRIMARY KEY (id);


--
-- Name: tomogram_authors tomogram_authors_tomogram_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomogram_authors
    ADD CONSTRAINT tomogram_authors_tomogram_id_name_key UNIQUE (tomogram_id, name);


--
-- Name: tomogram_type tomogram_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomogram_type
    ADD CONSTRAINT tomogram_type_pkey PRIMARY KEY (value);


--
-- Name: tomogram_voxel_spacings tomogram_voxel_spacing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomogram_voxel_spacings
    ADD CONSTRAINT tomogram_voxel_spacing_pkey PRIMARY KEY (id);


--
-- Name: tomograms tomograms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomograms
    ADD CONSTRAINT tomograms_pkey PRIMARY KEY (id);


--
-- Name: annotation_files_annotation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX annotation_files_annotation_id ON public.annotation_files USING btree (annotation_id);


--
-- Name: annotation_method; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX annotation_method ON public.annotations USING btree (annotation_method);


--
-- Name: annotations_deposition_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX annotations_deposition_id ON public.annotations USING btree (deposition_id);


--
-- Name: annotations_tomogram_voxel_spacing; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX annotations_tomogram_voxel_spacing ON public.annotations USING btree (tomogram_voxel_spacing_id);


--
-- Name: dataset_authors_dataset; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX dataset_authors_dataset ON public.dataset_authors USING btree (dataset_id);


--
-- Name: dataset_deposition_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX dataset_deposition_id ON public.datasets USING btree (deposition_id);


--
-- Name: dataset_funding_dataset; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX dataset_funding_dataset ON public.dataset_funding USING btree (dataset_id);


--
-- Name: depositions_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX depositions_type ON public.depositions USING btree (deposition_types);


--
-- Name: tiltseries_deposition_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tiltseries_deposition_id ON public.tiltseries USING btree (deposition_id);


--
-- Name: tiltseries_run; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tiltseries_run ON public.tiltseries USING btree (run_id);


--
-- Name: tomogram_voxel_spacing_run; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tomogram_voxel_spacing_run ON public.tomogram_voxel_spacings USING btree (run_id);


--
-- Name: tomograms_deposition_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tomograms_deposition_id ON public.tomograms USING btree (deposition_id);


--
-- Name: tomograms_tomogram_voxel_spacing_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tomograms_tomogram_voxel_spacing_id ON public.tomograms USING btree (tomogram_voxel_spacing_id);


--
-- Name: annotation_authors annotation_authors_annotation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotation_authors
    ADD CONSTRAINT annotation_authors_annotation_id_fkey FOREIGN KEY (annotation_id) REFERENCES public.annotations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: annotation_files annotation_files_annotation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotation_files
    ADD CONSTRAINT annotation_files_annotation_id_fkey FOREIGN KEY (annotation_id) REFERENCES public.annotations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: annotations annotations_tomogram_voxel_spacing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annotations
    ADD CONSTRAINT annotations_tomogram_voxel_spacing_id_fkey FOREIGN KEY (tomogram_voxel_spacing_id) REFERENCES public.tomogram_voxel_spacings(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: dataset_authors dataset_authors_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dataset_authors
    ADD CONSTRAINT dataset_authors_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.datasets(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: dataset_funding dataset_funding_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dataset_funding
    ADD CONSTRAINT dataset_funding_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.datasets(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: deposition_authors deposition_authors_deposition_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deposition_authors
    ADD CONSTRAINT deposition_authors_deposition_id_fkey FOREIGN KEY (deposition_id) REFERENCES public.depositions(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: runs runs_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.runs
    ADD CONSTRAINT runs_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.datasets(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: tiltseries tiltseries_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tiltseries
    ADD CONSTRAINT tiltseries_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.runs(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: tomogram_authors tomogram_authors_tomogram_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomogram_authors
    ADD CONSTRAINT tomogram_authors_tomogram_id_fkey FOREIGN KEY (tomogram_id) REFERENCES public.tomograms(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: tomogram_voxel_spacings tomogram_voxel_spacing_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomogram_voxel_spacings
    ADD CONSTRAINT tomogram_voxel_spacing_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.runs(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: tomograms tomograms_tomogram_voxel_spacing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomograms
    ADD CONSTRAINT tomograms_tomogram_voxel_spacing_id_fkey FOREIGN KEY (tomogram_voxel_spacing_id) REFERENCES public.tomogram_voxel_spacings(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: tomograms tomograms_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tomograms
    ADD CONSTRAINT tomograms_type_fkey FOREIGN KEY (type) REFERENCES public.tomogram_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

