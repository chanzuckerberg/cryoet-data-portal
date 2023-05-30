# Test README

This directory contains tests of the cryoet_data_portal package API, _and_ the use of the API on the
live "corpus", i.e., data in the public data portal S3 bucket. The tests use Pytest, and have
Pytest marks to control which tests are run.

Tests can be run in the usual manner. First, ensure you have cryoet_data_portal installed, e.g., from the top-level repo directory:

> pip install -e ./client/python/cryoet_data_portal/

Then run the tests:

> pytest ./client/python/cryoet_data_portal/

## Pytest Marks

There are two Pytest marks you can use from the command line:

- live_corpus: tests that directly access the portal api. Enabled by default.
- expensive: tests that are expensive (ie., cpu, memory, time). Disabled by default - enable with `--expensive`. Some of these tests are _very_ expensive, ie., require a very large memory host to succeed.

By default, only relatively cheap & fast tests are run. To enable `expensive` tests:

> pytest --expensive ...

To disable `live_corpus` tests:

> pytest -m 'not live_corpus'

You can also combine them, e.g.,

> pytest -m 'not live_corpus' --expensive
