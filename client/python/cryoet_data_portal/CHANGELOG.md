# Changelog

## [3.1.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/cryoet-data-portal-python-client-v3.0.3...cryoet-data-portal-python-client-v3.1.0) (2024-08-22)


### ✨ Features

* add user agent to client requests ([#966](https://github.com/chanzuckerberg/cryoet-data-portal/issues/966)) ([8209cd4](https://github.com/chanzuckerberg/cryoet-data-portal/commit/8209cd46cb8ab21341c7ee94672db3bae78f9aa2))
* Generate Python client code using GraphQL introspection ([#1008](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1008)) ([35b7265](https://github.com/chanzuckerberg/cryoet-data-portal/commit/35b72656e77132c9d64cc077705da8940bb29e44))


### 🐞 Bug Fixes

* create recursive_from_prefix path if it does not exist ([#940](https://github.com/chanzuckerberg/cryoet-data-portal/issues/940)) ([0069f08](https://github.com/chanzuckerberg/cryoet-data-portal/commit/0069f080987ac05efef82d024cb17f4dc307a0f3))
* Use match with substring for exception check in client tests ([#895](https://github.com/chanzuckerberg/cryoet-data-portal/issues/895)) ([07352ec](https://github.com/chanzuckerberg/cryoet-data-portal/commit/07352ecdb8c6f50ffe97ff7be9777c0cf6dd66cb))
* wait for graphql to be healthy in client tests ([#1044](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1044)) ([65f0a4b](https://github.com/chanzuckerberg/cryoet-data-portal/commit/65f0a4b76783ad32bbe439f62fc32f0cae3ae646)), closes [#942](https://github.com/chanzuckerberg/cryoet-data-portal/issues/942)


### 🧹 Miscellaneous Chores

* Add additional test case to TestGetDestinationPath ([#955](https://github.com/chanzuckerberg/cryoet-data-portal/issues/955)) ([a9412a8](https://github.com/chanzuckerberg/cryoet-data-portal/commit/a9412a80f3b24ff94b0803fdd59d3583b4521706))
* add instructions and commands to manually release the python package. ([#1073](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1073)) ([4833eb9](https://github.com/chanzuckerberg/cryoet-data-portal/commit/4833eb95d32ee06a5608e69d6aebf013b1c9fd73))
* automate release of python client ([#972](https://github.com/chanzuckerberg/cryoet-data-portal/issues/972)) ([073bff7](https://github.com/chanzuckerberg/cryoet-data-portal/commit/073bff7180e2ac3b390cac6a5665b63a7f00e472))
