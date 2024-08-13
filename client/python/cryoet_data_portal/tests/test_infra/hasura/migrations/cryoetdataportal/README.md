There should only be two migrations here.

# Initialization

The first init migration is created by dumping the schema from the test infrastructure defined in the cryoet data portal backend repo.

Assuming that the postgres container in that repo is running (e.g. after running `make init`), you can run

```
pg_dump --host=localhost --port=5432 --dbname=cryoet --username=postgres --schema=public --schema-only --no-owner --no-tablespaces -f 0000000000000_init/up.sql
```

to dump the commands necessary to define that schema. You may have to manually remove a few lines to make this work with the test infrastructure defined here (e.g. by removing `CREATE SCHEMA public`).

# Data definition

The second data migration is manually maintained.

It contains the commands to define fake data used for testing.
