alter table "public"."annotation_files" add column "is_visualization_default" boolean null default 'false';
alter table "public"."annotations" add column "method_type" varchar null;
alter table "public"."annotations" add column "deposition_id" integer null;
alter table "public"."tomograms" add column "deposition_id" integer null;
