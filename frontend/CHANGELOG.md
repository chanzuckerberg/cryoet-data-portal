# Changelog

## [1.5.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.4.1...web-v1.5.0) (2024-04-23)


### ✨ Features

* implement author name legend ([#625](https://github.com/chanzuckerberg/cryoet-data-portal/issues/625)) ([919930a](https://github.com/chanzuckerberg/cryoet-data-portal/commit/919930a9a17a6cffdee5d5a351dfea0b2459f9e2))


### 🐞 Bug Fixes

* use aws sync for dataset or all annotations download dialogs ([#671](https://github.com/chanzuckerberg/cryoet-data-portal/issues/671)) ([c71867f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c71867f9b179f570260d5a4751a14b2f817c95b9))

## [1.4.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.4.0...web-v1.4.1) (2024-04-19)


### 🐞 Bug Fixes

* Adding liveliness_timeout and readiness_timeout  ([#669](https://github.com/chanzuckerberg/cryoet-data-portal/issues/669)) ([d466888](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d4668884503e06e05e2dd3bf6e6e38e623b58e23))

## [1.4.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.3.1...web-v1.4.0) (2024-04-19)


### ✨ Features

* download single tomogram modal updates ([#591](https://github.com/chanzuckerberg/cryoet-data-portal/issues/591)) ([1c4f10b](https://github.com/chanzuckerberg/cryoet-data-portal/commit/1c4f10bf20c54cf8839db174158d6068e9cb7b0e))
* implement method type tooltips ([#568](https://github.com/chanzuckerberg/cryoet-data-portal/issues/568)) ([9022fda](https://github.com/chanzuckerberg/cryoet-data-portal/commit/9022fda0448827f14a53057845b35b561b83cbc8))
* release single annotation download annotation modal ([#668](https://github.com/chanzuckerberg/cryoet-data-portal/issues/668)) ([064510f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/064510fa4a4d4636001c28060d1a801fb98b283d))
* single annotation dialog step 2 ([#589](https://github.com/chanzuckerberg/cryoet-data-portal/issues/589)) ([3a4ac68](https://github.com/chanzuckerberg/cryoet-data-portal/commit/3a4ac686a1685a7790d1dd9ad2b4feaa2a3f4df5))


### 🐞 Bug Fixes

* annotation table primary author sort ([#649](https://github.com/chanzuckerberg/cryoet-data-portal/issues/649)) ([6f10619](https://github.com/chanzuckerberg/cryoet-data-portal/commit/6f106197ad23576db048bd9854eda29839861f1f))
* tilt range labels ([#620](https://github.com/chanzuckerberg/cryoet-data-portal/issues/620)) ([cd96713](https://github.com/chanzuckerberg/cryoet-data-portal/commit/cd9671394c6d996c38060423e21b57377606c6d0))
* Updating annotation object shape type query ([#666](https://github.com/chanzuckerberg/cryoet-data-portal/issues/666)) ([28908a1](https://github.com/chanzuckerberg/cryoet-data-portal/commit/28908a10c245320244a66e858bb0a296f2ffb75a))


### ⚡️ Performance Improvements

* measure getBrowseDatasets query perf ([#667](https://github.com/chanzuckerberg/cryoet-data-portal/issues/667)) ([722cfff](https://github.com/chanzuckerberg/cryoet-data-portal/commit/722cfff2f0b4575aa7ffbf91b7e5fb1d0c945417))


### ⚙ Continuous Integration

* fix download modal e2e tests ([#665](https://github.com/chanzuckerberg/cryoet-data-portal/issues/665)) ([4dde408](https://github.com/chanzuckerberg/cryoet-data-portal/commit/4dde408e60402683c181b52ae62991b18a47ca35))

## [1.3.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.3.0...web-v1.3.1) (2024-03-29)


### 🐞 Bug Fixes

* table column sizing ([#551](https://github.com/chanzuckerberg/cryoet-data-portal/issues/551)) ([174f52c](https://github.com/chanzuckerberg/cryoet-data-portal/commit/174f52c9f4e43c080e857ae59a8c569d174122d5))


### 🧹 Miscellaneous Chores

* **deps:** bump express from 4.18.2 to 4.19.2 in /frontend ([#607](https://github.com/chanzuckerberg/cryoet-data-portal/issues/607)) ([d94d8a5](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d94d8a5654a522eb47fbf98fb7eaaf11db60c6ea))
* **deps:** bump katex from 0.16.9 to 0.16.10 in /frontend ([#606](https://github.com/chanzuckerberg/cryoet-data-portal/issues/606)) ([34e48df](https://github.com/chanzuckerberg/cryoet-data-portal/commit/34e48df1bbf7d58a5489ee94d705e5d08e3df4aa))

## [1.3.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.2.1...web-v1.3.0) (2024-03-22)


### ✨ Features

* add additional filters to single dataset page ([#573](https://github.com/chanzuckerberg/cryoet-data-portal/issues/573)) ([8f4e688](https://github.com/chanzuckerberg/cryoet-data-portal/commit/8f4e688ddda40d5f20b764760f7606fdd344d6a2))
* single annotation download dialog step 1 ([#557](https://github.com/chanzuckerberg/cryoet-data-portal/issues/557)) ([2610ec6](https://github.com/chanzuckerberg/cryoet-data-portal/commit/2610ec678b718ddaaa8bc40e430650c60241c8f8))


### 🧹 Miscellaneous Chores

* hide download annotation button behind flag ([#604](https://github.com/chanzuckerberg/cryoet-data-portal/issues/604)) ([1a5a7da](https://github.com/chanzuckerberg/cryoet-data-portal/commit/1a5a7da26bf5ac97543d0a469c8eb2752ba04430))
* support multiple envs for feature flags ([#576](https://github.com/chanzuckerberg/cryoet-data-portal/issues/576)) ([b53b2c0](https://github.com/chanzuckerberg/cryoet-data-portal/commit/b53b2c00f983faade5aa0bad814469b58e9b6b78))
* update annotation metadata panel ([#575](https://github.com/chanzuckerberg/cryoet-data-portal/issues/575)) ([984d2f9](https://github.com/chanzuckerberg/cryoet-data-portal/commit/984d2f94a6f5b3ce47a40c83e61f83c1065e4f1c))

## [1.2.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.2.0...web-v1.2.1) (2024-03-08)


### 🐞 Bug Fixes

* initial load render error ([#531](https://github.com/chanzuckerberg/cryoet-data-portal/issues/531)) ([0d2af5f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/0d2af5f528804b05b19f2a616f395b4faecdc1e2))
* no tomogram error ([#559](https://github.com/chanzuckerberg/cryoet-data-portal/issues/559)) ([a96f1c1](https://github.com/chanzuckerberg/cryoet-data-portal/commit/a96f1c106345824170f426da4c2c734bed4040fc))
* pixel spacing and total flux units ([#558](https://github.com/chanzuckerberg/cryoet-data-portal/issues/558)) ([59a5bda](https://github.com/chanzuckerberg/cryoet-data-portal/commit/59a5bda7e5e2cf45bd8a66b12bef1fa874084a8a))
* update aws command ([#550](https://github.com/chanzuckerberg/cryoet-data-portal/issues/550)) ([5f46cef](https://github.com/chanzuckerberg/cryoet-data-portal/commit/5f46cef560df62791c1b3b5e9e18026b691a2ef0))


### 💅 Styles

* fix method type styling ([#566](https://github.com/chanzuckerberg/cryoet-data-portal/issues/566)) ([445b43f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/445b43f21992e53b1f3f8e8d2d6edbe109765837))


### 🧹 Miscellaneous Chores

* add e2e tests for download dialogs ([#510](https://github.com/chanzuckerberg/cryoet-data-portal/issues/510)) ([206c81c](https://github.com/chanzuckerberg/cryoet-data-portal/commit/206c81c37f074d241653d26e75408711ea5d4fe4))
* update tilt range label ([#552](https://github.com/chanzuckerberg/cryoet-data-portal/issues/552)) ([abdb1a2](https://github.com/chanzuckerberg/cryoet-data-portal/commit/abdb1a2bfbe64736cf464f9480e94239a7cf4b22))


### ⚙ Continuous Integration

* fix download e2e tests ([#561](https://github.com/chanzuckerberg/cryoet-data-portal/issues/561)) ([ac4e2dc](https://github.com/chanzuckerberg/cryoet-data-portal/commit/ac4e2dcd5df76f344bc7bc3ad6221efb8aa625e2))

## [1.2.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.1.1...web-v1.2.0) (2024-03-02)


### ✨ Features

* file format dropdown ([#526](https://github.com/chanzuckerberg/cryoet-data-portal/issues/526)) ([4f0ad0b](https://github.com/chanzuckerberg/cryoet-data-portal/commit/4f0ad0b9e0e2a660908c5531ad68d2e1f49862db))

## [1.1.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.1.0...web-v1.1.1) (2024-02-29)


### 🐞 Bug Fixes

* prod deploy tagging ([#516](https://github.com/chanzuckerberg/cryoet-data-portal/issues/516)) ([2a4524d](https://github.com/chanzuckerberg/cryoet-data-portal/commit/2a4524d53fac1bf6219bbfa8e49d5d6b9995d2c8))


### 🧹 Miscellaneous Chores

* add sh to readme ([#518](https://github.com/chanzuckerberg/cryoet-data-portal/issues/518)) ([ac54fd4](https://github.com/chanzuckerberg/cryoet-data-portal/commit/ac54fd40fc2749ab2e0b190a6b8c61109ef12a37))

## [1.1.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.0.1...web-v1.1.0) (2024-02-29)


### ✨ Features

* annotation table updates ([#481](https://github.com/chanzuckerberg/cryoet-data-portal/issues/481)) ([097e271](https://github.com/chanzuckerberg/cryoet-data-portal/commit/097e2716e246d39e3d36791dacd178bd42a86d9d))


### 🐞 Bug Fixes

* Mapping samplings available to db field ([#487](https://github.com/chanzuckerberg/cryoet-data-portal/issues/487)) ([7730efb](https://github.com/chanzuckerberg/cryoet-data-portal/commit/7730efbab4a2a66ba74af846eaa1870912e18646))
* remove axios cache ([#505](https://github.com/chanzuckerberg/cryoet-data-portal/issues/505)) ([6b4d2f2](https://github.com/chanzuckerberg/cryoet-data-portal/commit/6b4d2f2cb4db3c07d831f7f213a1dfd95705480f))


### 🧹 Miscellaneous Chores

* fix release workflow ([#508](https://github.com/chanzuckerberg/cryoet-data-portal/issues/508)) ([1cf95e6](https://github.com/chanzuckerberg/cryoet-data-portal/commit/1cf95e69caf716a6914f7b52cb9a3d93c435fb40))
* **main:** release cryoet-data-portal 1.0.1 ([#506](https://github.com/chanzuckerberg/cryoet-data-portal/issues/506)) ([c9896c7](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c9896c77149b27c7137953ba5af2b6f638b4f6a3))

## [1.0.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/cryoet-data-portal-v1.0.0...cryoet-data-portal-v1.0.1) (2024-02-23)


### 🐞 Bug Fixes

* remove axios cache ([#505](https://github.com/chanzuckerberg/cryoet-data-portal/issues/505)) ([6b4d2f2](https://github.com/chanzuckerberg/cryoet-data-portal/commit/6b4d2f2cb4db3c07d831f7f213a1dfd95705480f))
