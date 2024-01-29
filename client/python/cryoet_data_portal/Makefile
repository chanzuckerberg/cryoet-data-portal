.PHONY: test-infra
test-infra:
	cd tests && docker compose up -d
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
		pytest -vvv -s .
