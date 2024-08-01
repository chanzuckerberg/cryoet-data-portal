alter table "public"."annotation_authors" add column "primary_author_status" boolean
 null;
UPDATE "public"."annotation_authors" SET primary_author_status = primary_annotator_status;
