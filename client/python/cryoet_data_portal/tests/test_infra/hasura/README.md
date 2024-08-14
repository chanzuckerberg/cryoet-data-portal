The hasura metadata and migrations need to be manually kept in sync with the definitions in the backend repo.

# Metadata

This can simply be copied over with a command like the following

```shell
cp -r ~/src/cryoet-data-portal-backend/api_server/metadata .
```

# Migrations

There should only be one table (cryoetdataportal) with two migrations.

## Initialization

The first init migration is created by dumping the schema from the test infrastructure defined in the cryoet data portal backend repo.

Assuming that the postgres container in that repo is running (e.g. after running `make init`), you can run

```
pg_dump --host=localhost --port=5432 --dbname=cryoet --username=postgres --schema=public --schema-only --no-owner --no-tablespaces -f migrations/cryoetdataportal/0000000000000_init/up.sql
```

to dump the commands necessary to define that schema. You may have to manually remove a few lines to make this work with the test infrastructure defined here (e.g. by removing `CREATE SCHEMA public`).

## Data definition

The second data migration is manually maintained.

It contains the commands to define fake data used for testing.

The values here only matter with respect to any tests against the client.

When defining new fake values, be creative and ideally avoid real values (e.g. actual author names from the portal).
