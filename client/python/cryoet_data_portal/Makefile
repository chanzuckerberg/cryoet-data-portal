.PHONY: test-infra
test-infra:
	# Use force-recreate to handle re-initializing the database schema and data
	# rather than maintaining incremental migrations.
	# See the test_infra/hasura/README.md for more details.
	cd tests && docker compose up -d --wait --wait-timeout 300 --force-recreate
	cd ./tests/test_infra/; ./seed_moto.sh

.PHONY: coverage
coverage:
	export AWS_REGION=us-west-2; \
		export AWS_ACCESS_KEY_ID=test; \
		export AWS_SECRET_ACCESS_KEY=test; \
		export BOTO_ENDPOINT_URL=http://localhost:4000; \
		export BOTO_SIGNATURE_VERSION=s3v4; \
		coverage run --parallel-mode -m pytest -v -rP --durations=20 ./tests/

.PHONY: test
test:
	export AWS_REGION=us-west-2; \
		export AWS_ACCESS_KEY_ID=test; \
		export AWS_SECRET_ACCESS_KEY=test; \
		export BOTO_ENDPOINT_URL=http://localhost:4000; \
		export BOTO_SIGNATURE_VERSION=s3v4; \
		pytest -vvv -s . $(TEST)

.PHONY: codegen
codegen:
	python -m cryoet_data_portal._codegen
	# Need to run pre-commit twice because black and ruff fight with each other.
	# Ignore the return code because that is non-zero when pre-commit applies a fix.
	-pre-commit run --files src/cryoet_data_portal/_models.py src/cryoet_data_portal/data/schema.graphql
	-pre-commit run --files src/cryoet_data_portal/_models.py src/cryoet_data_portal/data/schema.graphql
