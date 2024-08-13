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

ALTER TABLE IF EXISTS ONLY public.tomograms DROP CONSTRAINT IF EXISTS tomograms_type_fkey;
ALTER TABLE IF EXISTS ONLY public.tomograms DROP CONSTRAINT IF EXISTS tomograms_tomogram_voxel_spacing_id_fkey;
ALTER TABLE IF EXISTS ONLY public.tomogram_voxel_spacings DROP CONSTRAINT IF EXISTS tomogram_voxel_spacing_run_id_fkey;
ALTER TABLE IF EXISTS ONLY public.tomogram_authors DROP CONSTRAINT IF EXISTS tomogram_authors_tomogram_id_fkey;
ALTER TABLE IF EXISTS ONLY public.tiltseries DROP CONSTRAINT IF EXISTS tiltseries_run_id_fkey;
ALTER TABLE IF EXISTS ONLY public.runs DROP CONSTRAINT IF EXISTS runs_dataset_id_fkey;
ALTER TABLE IF EXISTS ONLY public.dataset_funding DROP CONSTRAINT IF EXISTS dataset_funding_dataset_id_fkey;
ALTER TABLE IF EXISTS ONLY public.dataset_authors DROP CONSTRAINT IF EXISTS dataset_authors_dataset_id_fkey;
ALTER TABLE IF EXISTS ONLY public.annotations DROP CONSTRAINT IF EXISTS annotations_tomogram_voxel_spacing_id_fkey;
ALTER TABLE IF EXISTS ONLY public.annotation_files DROP CONSTRAINT IF EXISTS annotation_files_annotation_id_fkey;
ALTER TABLE IF EXISTS ONLY public.annotation_authors DROP CONSTRAINT IF EXISTS annotation_authors_annotation_id_fkey;
DROP INDEX IF EXISTS public.tomograms_tomogram_voxel_spacing_id;
DROP INDEX IF EXISTS public.tomogram_voxel_spacing_run;
DROP INDEX IF EXISTS public.tiltseries_run;
DROP INDEX IF EXISTS public.dataset_funding_dataset;
DROP INDEX IF EXISTS public.dataset_authors_dataset;
DROP INDEX IF EXISTS public.annotations_tomogram_voxel_spacing;
DROP INDEX IF EXISTS public.annotation_files_annotation_id;
ALTER TABLE IF EXISTS ONLY public.tomograms DROP CONSTRAINT IF EXISTS tomograms_pkey;
ALTER TABLE IF EXISTS ONLY public.tomogram_voxel_spacings DROP CONSTRAINT IF EXISTS tomogram_voxel_spacing_pkey;
ALTER TABLE IF EXISTS ONLY public.tomogram_type DROP CONSTRAINT IF EXISTS tomogram_type_pkey;
ALTER TABLE IF EXISTS ONLY public.tomogram_authors DROP CONSTRAINT IF EXISTS tomogram_authors_tomogram_id_name_key;
ALTER TABLE IF EXISTS ONLY public.tomogram_authors DROP CONSTRAINT IF EXISTS tomogram_authors_pkey;
ALTER TABLE IF EXISTS ONLY public.tiltseries DROP CONSTRAINT IF EXISTS tiltseries_pkey;
ALTER TABLE IF EXISTS ONLY public.runs DROP CONSTRAINT IF EXISTS runs_pkey;
ALTER TABLE IF EXISTS ONLY public.runs DROP CONSTRAINT IF EXISTS runs_dataset_id_name_key;
ALTER TABLE IF EXISTS ONLY public.datasets DROP CONSTRAINT IF EXISTS datasets_pkey;
ALTER TABLE IF EXISTS ONLY public.dataset_funding DROP CONSTRAINT IF EXISTS dataset_funding_pkey;
ALTER TABLE IF EXISTS ONLY public.dataset_authors DROP CONSTRAINT IF EXISTS dataset_authors_pkey;
ALTER TABLE IF EXISTS ONLY public.annotations DROP CONSTRAINT IF EXISTS annotations_pkey;
ALTER TABLE IF EXISTS ONLY public.annotation_files DROP CONSTRAINT IF EXISTS annotation_files_shape_type_annotation_id_format_key;
ALTER TABLE IF EXISTS ONLY public.annotation_files DROP CONSTRAINT IF EXISTS annotation_files_pkey;
ALTER TABLE IF EXISTS ONLY public.annotation_authors DROP CONSTRAINT IF EXISTS annotation_authors_pkey;
ALTER TABLE IF EXISTS ONLY public.annotation_authors DROP CONSTRAINT IF EXISTS annotation_authors_annotation_id_name_key;
ALTER TABLE IF EXISTS public.tomograms ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tomogram_voxel_spacings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tomogram_authors ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tiltseries ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.runs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.dataset_funding ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.dataset_authors ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.annotations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.annotation_files ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.annotation_authors ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.tomograms_id_seq;
DROP TABLE IF EXISTS public.tomograms;
DROP SEQUENCE IF EXISTS public.tomogram_voxel_spacing_id_seq;
DROP TABLE IF EXISTS public.tomogram_voxel_spacings;
DROP TABLE IF EXISTS public.tomogram_type;
DROP SEQUENCE IF EXISTS public.tomogram_authors_id_seq;
DROP TABLE IF EXISTS public.tomogram_authors;
DROP SEQUENCE IF EXISTS public.tiltseries_id_seq;
DROP TABLE IF EXISTS public.tiltseries;
DROP SEQUENCE IF EXISTS public.runs_id_seq;
DROP TABLE IF EXISTS public.runs;
DROP TABLE IF EXISTS public.datasets;
DROP SEQUENCE IF EXISTS public.dataset_funding_id_seq;
DROP TABLE IF EXISTS public.dataset_funding;
DROP SEQUENCE IF EXISTS public.dataset_authors_id_seq;
DROP TABLE IF EXISTS public.dataset_authors;
DROP SEQUENCE IF EXISTS public.annotations_id_seq;
DROP TABLE IF EXISTS public.annotations;
DROP SEQUENCE IF EXISTS public.annotation_files_id_seq;
DROP TABLE IF EXISTS public.annotation_files;
DROP SEQUENCE IF EXISTS public.annotation_authors_id_seq;
DROP TABLE IF EXISTS public.annotation_authors;
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

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


ALTER TABLE public.annotation_authors OWNER TO postgres;

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


ALTER TABLE public.annotation_authors_id_seq OWNER TO postgres;

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


ALTER TABLE public.annotation_files OWNER TO postgres;

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


ALTER TABLE public.annotation_files_id_seq OWNER TO postgres;

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
    deposition_id integer
);


ALTER TABLE public.annotations OWNER TO postgres;

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


ALTER TABLE public.annotations_id_seq OWNER TO postgres;

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


ALTER TABLE public.dataset_authors OWNER TO postgres;

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


ALTER TABLE public.dataset_authors_id_seq OWNER TO postgres;

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


ALTER TABLE public.dataset_funding OWNER TO postgres;

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


ALTER TABLE public.dataset_funding_id_seq OWNER TO postgres;

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
    cell_component_id character varying
);


ALTER TABLE public.datasets OWNER TO postgres;

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


ALTER TABLE public.runs OWNER TO postgres;

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


ALTER TABLE public.runs_id_seq OWNER TO postgres;

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
    frames_count integer DEFAULT 0
);


ALTER TABLE public.tiltseries OWNER TO postgres;

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


ALTER TABLE public.tiltseries_id_seq OWNER TO postgres;

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


ALTER TABLE public.tomogram_authors OWNER TO postgres;

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


ALTER TABLE public.tomogram_authors_id_seq OWNER TO postgres;

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


ALTER TABLE public.tomogram_type OWNER TO postgres;

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


ALTER TABLE public.tomogram_voxel_spacings OWNER TO postgres;

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


ALTER TABLE public.tomogram_voxel_spacing_id_seq OWNER TO postgres;

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


ALTER TABLE public.tomograms OWNER TO postgres;

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


ALTER TABLE public.tomograms_id_seq OWNER TO postgres;

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


--
-- Data for Name: annotation_authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.annotation_authors (id, annotation_id, name, orcid, corresponding_author_status, primary_annotator_status, email, affiliation_name, affiliation_address, affiliation_identifier, author_list_order, primary_author_status) FROM stdin;
50	40	Author 1	0000-0000-0000-0007	f	t	\N	\N	\N	\N	\N	t
51	40	Author 2	0000-0000-0000-0008	f	t	\N	\N	\N	\N	\N	t
52	41	Author 1	0000-0000-0000-0007	f	t	\N	\N	\N	\N	\N	t
53	41	Author 2	0000-0000-0000-0008	f	t	\N	\N	\N	\N	\N	t
54	42	Author 3	0000-0000-0000-0039	f	t	\N	\N	\N	\N	\N	t
55	42	Author 4	0000-0000-0000-0049	f	t	\N	\N	\N	\N	\N	t
56	43	Author 5	0000-0000-0000-0059	f	t	\N	\N	\N	\N	\N	t
57	44	Author 6	0000-0000-0000-0069	f	t	\N	\N	\N	\N	\N	t
58	45	Author 7	0000-0000-0000-0079	f	t	\N	\N	\N	\N	\N	t
59	45	Author 8	0000-0000-0000-0089	f	t	\N	\N	\N	\N	\N	t
\.


--
-- Data for Name: annotation_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.annotation_files (id, annotation_id, shape_type, format, https_path, s3_path, is_visualization_default) FROM stdin;
70	40	OrientedPoint	ndjson	http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.ndjson	s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.ndjson	f
71	40	SegmentationMask	mrc	http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.mrc	s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.mrc	f
72	40	SegmentationMask	zarr	http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.zarr	s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.zarr	f
73	41	Point	ndjson	http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.ndjson	s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.ndjson	f
74	41	SegmentationMask	mrc	http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.mrc	s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.mrc	f
75	41	SegmentationMask	zarr	http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.zarr	s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.zarr	f
76	42	OrientedPoint	ndjson	http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.ndjson	s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.ndjson	f
77	42	SegmentationMask	mrc	http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.mrc	s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.mrc	f
78	42	SegmentationMask	zarr	http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.zarr	s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.zarr	f
79	43	OrientedPoint	ndjson	http://localhost:4444/20002/RUN001/TomogramVoxelSpacing7.56/Annotations/ribosome.ndjson	s3://test-public-bucket/20002/RUN001/TomogramVoxelSpacing13.48/Annotations/ribosome.ndjson	f
80	44	SegmentationMask	zarr	http://localhost:4444/20002/RUN002/TomogramVoxelSpacing7.56/Annotations/ribosome.zarr	s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/ribosome.zarr	f
81	44	SegmentationMask	mrc	http://localhost:4444/20002/RUN002/TomogramVoxelSpacing7.56/Annotations/ribosome.mrc	s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/ribosome.mrc	f
82	45	Point	ndjson	http://localhost:4444/20002/RUN002/TomogramVoxelSpacing7.56/Annotations/ribosome.json	s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/ribosome.json	f
\.


--
-- Data for Name: annotations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.annotations (id, s3_metadata_path, https_metadata_path, deposition_date, release_date, last_modified_date, annotation_publication, annotation_method, ground_truth_status, object_name, object_id, object_description, object_state, object_count, confidence_precision, confidence_recall, ground_truth_used, tomogram_voxel_spacing_id, annotation_software, is_curator_recommended, method_type, deposition_id) FROM stdin;
40	s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/author1-mitochondria-1.0.json	http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/author1-mitochondria-1.0.json	2023-04-01	2023-06-01	2023-06-01	EMPIAR-77777	Manual	t	Mitochondria	GO:0000000	\N	\N	16	\N	\N	\N	4	\N	t	\N	\N
41	s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/author1-ribosome-1.0.json	http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/author1-ribosome-1.0.json	2023-04-01	2023-06-01	2023-06-01	EMPIAR-77777	Manual	t	Ribosome	GO:000000A	\N	\N	16	\N	\N	\N	4	\N	t	\N	\N
42	s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/author2-ribosome-1.0.json	http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/author2-ribosome-1.0.json	2023-04-01	2023-06-01	2023-06-01	EMPIAR-77777	Manual	t	Ribosome	GO:000000A	\N	\N	16	\N	\N	\N	5	\N	t	\N	\N
43	s3://test-public-bucket/20002/RUN001/TomogramVoxelSpacing7.56/Annotations/author3-ribosome-1.0.json	http://localhost:4444/20002/RUN001/TomogramVoxelSpacing7.56/Annotations/author3-ribosome-1.0.json	2023-04-01	2023-06-01	2023-06-01	EMPIAR-77777	Manual	t	Ribosome	GO:000000A	\N	\N	16	\N	\N	\N	6	\N	t	\N	\N
44	s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/author4-ribosome-1.0.json	http://localhost:4444/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/author4-ribosome-1.0.json	2023-04-01	2023-06-01	2023-06-01	EMPIAR-77777	Manual	t	Ribosome	GO:000000A	\N	\N	16	\N	\N	\N	7	\N	t	\N	\N
45	s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/author4-spike-1.0.json	http://localhost:4444/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/author4-spike-1.0.json	2023-04-01	2023-06-01	2023-06-01	EMPIAR-77777	Manual	t	Spike Protein	GO:000000A	\N	\N	16	\N	\N	\N	7	\N	t	\N	\N
\.


--
-- Data for Name: dataset_authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dataset_authors (id, name, orcid, corresponding_author_status, email, affiliation_name, affiliation_address, affiliation_identifier, dataset_id, primary_author_status, author_list_order) FROM stdin;
1	Author 1	\N	f	\N	\N	\N	\N	20001	t	\N
2	Author 2	0000-2222-9999-8888	f	\N	\N	\N	\N	20001	t	\N
3	Author 3	\N	f	\N	\N	\N	\N	20002	t	\N
4	Author 4	4444-2222-9999-8888	f	\N	\N	\N	\N	20002	t	\N
\.


--
-- Data for Name: dataset_funding; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dataset_funding (id, dataset_id, funding_agency_name, grant_id) FROM stdin;
1	20001	Grant For dataset1	11111
2	20002	Grant For dataset2	22222
\.


--
-- Data for Name: datasets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.datasets (id, title, description, deposition_date, release_date, last_modified_date, related_database_entries, related_database_links, dataset_publications, dataset_citations, sample_type, organism_name, organism_taxid, tissue_name, tissue_id, cell_name, cell_type_id, cell_strain_name, cell_strain_id, sample_preparation, grid_preparation, other_setup, s3_prefix, https_prefix, key_photo_url, key_photo_thumbnail_url, cell_component_name, cell_component_id) FROM stdin;
20001	Test Dataset 1	Description 1	2023-04-01	2023-06-01	2023-06-01	\N	\N	EMPIAR-99990, EMD-12345, EMD-12346, 10.1101/2022.01.01.111111	\N	organism	Test Bacteria 1	5555	\N	\N			\N	http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=8888	Sample Prep 1	Grid Prep 1	\N	s3://test-public-bucket/20001/	http://localhost:4444/20001/	\N	\N	\N	\N
20002	Test Dataset 2	Description 2	2023-02-01	2023-06-21	2023-06-22	\N	\N	EMPIAR-99991, 10.1101/2022.01.01.22222	\N	organism	Test Virus 2	6666	\N	\N			\N	http://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=7777	Sample Prep 2	Grid Prep 2	\N	s3://test-public-bucket/20002/	http://localhost:4444/20002/	\N	\N	\N	\N
\.


--
-- Data for Name: runs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.runs (id, dataset_id, name, s3_prefix, https_prefix) FROM stdin;
1	20001	RUN1	s3://test-public-bucket/20001/RUN1/	http://localhost:4444/20001/RUN1/
2	20001	RUN2	s3://test-public-bucket/20001/RUN2/	http://localhost:4444/20001/RUN2/
3	20002	RUN001	s3://test-public-bucket/20002/RUN001/	http://localhost:4444/20002/RUN001/
4	20002	RUN002	s3://test-public-bucket/20002/RUN002/	http://localhost:4444/20002/RUN002/
\.


--
-- Data for Name: tiltseries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tiltseries (id, run_id, s3_mrc_bin1, s3_omezarr_dir, https_mrc_bin1, https_omezarr_dir, s3_collection_metadata, https_collection_metadata, s3_angle_list, https_angle_list, s3_alignment_file, https_alignment_file, acceleration_voltage, spherical_aberration_constant, microscope_manufacturer, microscope_model, microscope_energy_filter, microscope_phase_plate, microscope_image_corrector, microscope_additional_info, camera_manufacturer, camera_model, tilt_min, tilt_max, tilt_range, tilt_step, tilting_scheme, tilt_axis, total_flux, data_acquisition_software, related_empiar_entry, binning_from_frames, tilt_series_quality, is_aligned, pixel_spacing, aligned_tiltseries_binning, frames_count) FROM stdin;
11	1	s3://test-public-bucket/20001/RUN1/TiltSeries/RUN1_bin1.mrc	s3://test-public-bucket/20001/RUN1/TiltSeries/RUN1.zarr	http://localhost:4444/20001/RUN1/TiltSeries/RUN1_bin1.mrc	http://localhost:4444/20001/RUN1/TiltSeries/RUN1.zarr	s3://test-public-bucket/20001/RUN1/TiltSeries/RUN1.mdoc	http://localhost:4444/20001/RUN1/TiltSeries/RUN1.mdoc	s3://test-public-bucket/20001/RUN1/TiltSeries/RUN1.rawtlt	http://localhost:4444/20001/RUN1/TiltSeries/RUN1.rawtlt	s3://test-public-bucket/20001/RUN1/TiltSeries/RUN1.xf	http://localhost:4444/20001/RUN1/TiltSeries/RUN1.xf	300000	2.7	MicroCorp	MicroZap5000	PhaseOTron	None	None	\N	FancyCam	Sharpshooter	-30.0	30.0	60.0	2.0	Dose symmetric from 0.0 degrees	84.7	122.0	Software1	\N	1.0	5	f	\N	\N	0
12	2	s3://test-public-bucket/20001/RUN2/TiltSeries/RUN2.mrc	s3://test-public-bucket/20001/RUN2/TiltSeries/RUN2.zarr	http://localhost:4444/20001/RUN2/TiltSeries/RUN2.mrc	http://localhost:4444/20001/RUN2/TiltSeries/RUN2.zarr	s3://test-public-bucket/20001/RUN2/TiltSeries/RUN2.mdoc	http://localhost:4444/20001/RUN2/TiltSeries/RUN2.mdoc	s3://test-public-bucket/20001/RUN2/TiltSeries/RUN2.rawtlt	http://localhost:4444/20001/RUN2/TiltSeries/RUN2.rawtlt	s3://test-public-bucket/20001/RUN2/TiltSeries/RUN2.xf	http://localhost:4444/20001/RUN2/TiltSeries/RUN2.xf	300000	2.7	MicroCorp	MicroZap5000	PhaseOTron	None	None	\N	FancyCam	Sharpshooter	-30.0	30.0	60.0	2.0	Dose symmetric from 0.0 degrees	84.7	122.0	Software1	\N	1.0	5	f	\N	\N	0
13	3	s3://test-public-bucket/20002/RUN001/TiltSeries/RUN001.mrc	s3://test-public-bucket/20002/RUN001/TiltSeries/RUN001.zarr	http://localhost:4444/20002/RUN001/TiltSeries/RUN001.mrc	http://localhost:4444/20002/RUN001/TiltSeries/RUN001.zarr	s3://test-public-bucket/20002/RUN001/TiltSeries/RUN001.mdoc	http://localhost:4444/20002/RUN001/TiltSeries/RUN001.mdoc	s3://test-public-bucket/20002/RUN001/TiltSeries/RUN001.rawtlt	http://localhost:4444/20002/RUN001/TiltSeries/RUN001.rawtlt	s3://test-public-bucket/20002/RUN001/TiltSeries/RUN001.xf	http://localhost:4444/20002/RUN001/TiltSeries/RUN001.xf	300000	2.7	MicroCorp	MicroZap5000	PhaseOTron	None	None	\N	FancyCam	Sharpshooter	-30.0	30.0	60.0	2.0	Dose symmetric from 0.0 degrees	84.7	122.0	Software1	\N	1.0	5	f	\N	\N	0
14	4	s3://test-public-bucket/20002/RUN002/TiltSeries/RUN002.mrc	s3://test-public-bucket/20002/RUN002/TiltSeries/RUN002.zarr	http://localhost:4444/20002/RUN002/TiltSeries/RUN002.mrc	http://localhost:4444/20002/RUN002/TiltSeries/RUN002.zarr	s3://test-public-bucket/20002/RUN002/TiltSeries/RUN002.mdoc	http://localhost:4444/20002/RUN002/TiltSeries/RUN002.mdoc	s3://test-public-bucket/20002/RUN002/TiltSeries/RUN002.rawtlt	http://localhost:4444/20002/RUN002/TiltSeries/RUN002.rawtlt	s3://test-public-bucket/20002/RUN002/TiltSeries/RUN002.xf	http://localhost:4444/20002/RUN002/TiltSeries/RUN002.xf	300000	2.7	MicroCorp	MicroZap5000	PhaseOTron	None	None	\N	FancyCam	Sharpshooter	-30.0	30.0	60.0	2.0	Dose symmetric from 0.0 degrees	84.7	122.0	Software1	\N	1.0	5	f	\N	\N	0
\.


--
-- Data for Name: tomogram_authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tomogram_authors (id, tomogram_id, author_list_order, name, orcid, corresponding_author_status, primary_author_status, email, affiliation_name, affiliation_address, affiliation_identifier) FROM stdin;
91	31	1	Bob Bobberson	03234234234	t	f	bob@bobberson.com	\N	\N	\N
92	31	2	Rob Robberson	44444234234	f	f	rob@robberson.com	\N	\N	\N
93	32	1	Alexis Alexei	03234999994	f	f	lex@lexis.com	\N	\N	\N
94	32	2	Chad Chadders	44444888834	f	f	chad@cheddar.com	\N	\N	\N
95	33	1	Kate Kateey	33334999994	f	f	kate@katey.com	\N	\N	\N
96	33	2	May Mayabell	55554888834	f	t	may@mayabell.com	\N	\N	\N
97	34	1	Hal Hallow	11111999994	t	f	hal@hallow.com	\N	\N	\N
98	34	2	Marc Marker	66666888834	f	t	marc@marker.com	\N	\N	\N
\.


--
-- Data for Name: tomogram_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tomogram_type (value, description) FROM stdin;
CANONICAL	\N
UNKNOWN	\N
\.


--
-- Data for Name: tomogram_voxel_spacings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tomogram_voxel_spacings (id, run_id, voxel_spacing, s3_prefix, https_prefix) FROM stdin;
4	1	13.48	s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/	http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/
5	2	7.56	s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/	http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/
6	3	7.56	s3://test-public-bucket/20002/RUN001/TomogramVoxelSpacing7.56/	http://localhost:4444/20002/RUN001/TomogramVoxelSpacing7.56/
7	4	13.48	s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/	http://localhost:4444/20002/RUN002/TomogramVoxelSpacing13.48/
\.


--
-- Data for Name: tomograms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tomograms (id, name, size_x, size_y, size_z, voxel_spacing, fiducial_alignment_status, reconstruction_method, reconstruction_software, processing, processing_software, tomogram_version, is_canonical, s3_omezarr_dir, https_omezarr_dir, s3_mrc_scale0, https_mrc_scale0, scale0_dimensions, scale1_dimensions, scale2_dimensions, ctf_corrected, tomogram_voxel_spacing_id, offset_x, offset_y, offset_z, affine_transformation_matrix, key_photo_url, key_photo_thumbnail_url, neuroglancer_config, type, deposition_id) FROM stdin;
31	RUN1	960	928	500	13.48	NON_FIDUCIAL	Weighted back projection	SW1	raw	\N	1	t	s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN1.zarr	http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN1.zarr	s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN1.mrc	http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN1.mrc	960,928,500	480,464,250	240,232,125	f	4	0	0	0	\N	\N	\N	\N	\N	\N
32	RUN2	960	928	500	13.48	NON_FIDUCIAL	Weighted back projection	SW1	raw	\N	1	t	s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN2.zarr	http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN2.zarr	s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN2.mrc	http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN2.mrc	960,928,500	480,464,250	240,232,125	f	5	0	0	0	\N	\N	\N	\N	\N	\N
33	RUN001	960	928	500	13.48	NON_FIDUCIAL	Weighted back projection	SW1	raw	\N	1	t	s3://test-public-bucket/20002/RUN001/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN001.zarr	http://localhost:4444/20002/RUN001/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN001.zarr	s3://test-public-bucket/20002/RUN001/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN001.mrc	s3://test-public-bucket/20002/RUN001/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN001.mrc	960,928,500	480,464,250	240,232,125	f	6	0	0	0	\N	\N	\N	\N	\N	\N
34	RUN002	960	928	500	13.48	NON_FIDUCIAL	Weighted back projection	SW1	raw	\N	1	t	s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN002.zarr	http://localhost:4444/20002/RUN002/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN002.zarr	s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN002.mrc	http://localhost:4444/20002/RUN002/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN002.mrc	960,928,500	480,464,250	240,232,125	f	7	0	0	0	\N	\N	\N	\N	\N	\N
\.


--
-- Name: annotation_authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.annotation_authors_id_seq', 1, false);


--
-- Name: annotation_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.annotation_files_id_seq', 1, false);


--
-- Name: annotations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.annotations_id_seq', 1, false);


--
-- Name: dataset_authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dataset_authors_id_seq', 1, false);


--
-- Name: dataset_funding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dataset_funding_id_seq', 1, false);


--
-- Name: runs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.runs_id_seq', 1, false);


--
-- Name: tiltseries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tiltseries_id_seq', 1, false);


--
-- Name: tomogram_authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tomogram_authors_id_seq', 1, false);


--
-- Name: tomogram_voxel_spacing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tomogram_voxel_spacing_id_seq', 1, false);


--
-- Name: tomograms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tomograms_id_seq', 1, false);


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
-- Name: annotations_tomogram_voxel_spacing; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX annotations_tomogram_voxel_spacing ON public.annotations USING btree (tomogram_voxel_spacing_id);


--
-- Name: dataset_authors_dataset; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX dataset_authors_dataset ON public.dataset_authors USING btree (dataset_id);


--
-- Name: dataset_funding_dataset; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX dataset_funding_dataset ON public.dataset_funding USING btree (dataset_id);


--
-- Name: tiltseries_run; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tiltseries_run ON public.tiltseries USING btree (run_id);


--
-- Name: tomogram_voxel_spacing_run; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tomogram_voxel_spacing_run ON public.tomogram_voxel_spacings USING btree (run_id);


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

