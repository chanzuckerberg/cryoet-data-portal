SHELL := /bin/bash

export BACKEND_DIR=/tmp/cryoet-data-portal-backend-test-infra
.PHONY: set-api-version
set-api-version:
	if [ ! -e $(BACKEND_DIR) ]; then git clone https://github.com/chanzuckerberg/cryoet-data-portal-backend.git $(BACKEND_DIR); fi
	export STAGING_SHA=$$(./tests/test_infra/get_deployment.sh staging); \
	if [ -n "$${STAGING_SHA}" ]; then \
	    echo "Setting backend to SHA: $${STAGING_SHA}"; \
	    cd $(BACKEND_DIR); \
	    git fetch; \
	    git reset --hard $$STAGING_SHA; \
	else \
	    echo "Could not get staging SHA!"; \
	    exit 1; \
	fi
	cd $(BACKEND_DIR) && make apiv2-init

.PHONY: test-infra
test-infra: set-api-version
	cp tests/test_infra/seed_db.py $(BACKEND_DIR)/apiv2/scripts
	cd $(BACKEND_DIR) && docker compose run graphql-api python3 scripts/seed_db.py
	cd ./tests/test_infra/; ./seed_moto.sh

.PHONY: clean
clean:
	if [ -e $(BACKEND_DIR) ]; then cd $(BACKEND_DIR); make clean; fi
	rm -rf $(BACKEND_DIR)

.PHONY: coverage
coverage:
	export AWS_REGION=us-west-2; \
		export AWS_ACCESS_KEY_ID=test; \
		export AWS_SECRET_ACCESS_KEY=test; \
		export BOTO_ENDPOINT_URL=http://localhost:5566; \
		export BOTO_SIGNATURE_VERSION=s3v4; \
		coverage run --parallel-mode -m pytest -v -rP --durations=20 ./tests/

.PHONY: test
test:
	export AWS_REGION=us-west-2; \
		export AWS_ACCESS_KEY_ID=test; \
		export AWS_SECRET_ACCESS_KEY=test; \
		export BOTO_ENDPOINT_URL=http://localhost:5566; \
		export BOTO_SIGNATURE_VERSION=s3v4; \
		pytest -vvv -s . $(TEST)

.PHONY: codegen
codegen:
	cd src && python3 -m cryoet_data_portal._codegen
	# Need to run pre-commit twice because black and ruff fight with each other.
	# Ignore the return code because that is non-zero when pre-commit applies a fix.
	-pre-commit run --files src/cryoet_data_portal/_models.py src/cryoet_data_portal/data/schema.graphql
	-pre-commit run --files src/cryoet_data_portal/_models.py src/cryoet_data_portal/data/schema.graphql

.PHONY: build
build:
	python -m pip install --upgrade pip
	pip install build twine
	python -m build

release/testpypi: build
	python -m twine upload --repository testpypi dist/*

release/pypi: build
	# Manually release in case CI/CD pipeline is not working in ./.github/workflows/release.yml
	python -m twine upload dist/*
