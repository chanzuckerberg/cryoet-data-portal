# Changelog

## [1.47.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.47.0...web-v1.47.1) (2025-01-29)


### 🧹 Miscellaneous Chores

* Skip failing test ([#1553](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1553)) ([2c5b084](https://github.com/chanzuckerberg/cryoet-data-portal/commit/2c5b0841f00e0a5bb2b92de08055f42afb6c5d12))

## [1.47.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.46.0...web-v1.47.0) (2025-01-28)


### ✨ Features

* Add timestamps to diff logs ([#1541](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1541)) ([c9fab5a](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c9fab5a2c841952e8f9519e6fcdeebb4298a2f4e))
* Complete migration of datasets page to V2 ([#1550](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1550)) ([bd7d690](https://github.com/chanzuckerberg/cryoet-data-portal/commit/bd7d69018483967f074a9320ba6418d920501dd6))
* Convert deposition page datasets table to use V2 data ([#1549](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1549)) ([d9cb610](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d9cb6104d67251d25a1f87149d74927b538f9783))
* Finish migrating deposition and datasets aggregates to use V2 ([#1512](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1512)) ([6221819](https://github.com/chanzuckerberg/cryoet-data-portal/commit/62218192c6fb1b2731116fc859af297609027588))
* Stop using V1 annotation method counts query in deposition page, switch to main deposition V2 query ([#1517](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1517)) ([ded3162](https://github.com/chanzuckerberg/cryoet-data-portal/commit/ded3162ff6352da9e721488d4680bd411d06f8af))

## [1.46.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.45.1...web-v1.46.0) (2025-01-27)


### ✨ Features

* Disable API migration test ([#1532](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1532)) ([8941b7b](https://github.com/chanzuckerberg/cryoet-data-portal/commit/8941b7bc7b49ac851a5f1cf0fdd83b070a058384))


### 🐞 Bug Fixes

* Ignore __typename in diff logs ([#1518](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1518)) ([f1b5416](https://github.com/chanzuckerberg/cryoet-data-portal/commit/f1b5416f75d69444088420bc139cec1304480805))
* Update prod image_pull_policy to Always ([#1534](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1534)) ([c738b36](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c738b361a4b21642ec99b26133c8f4998c06b788))
* Update staging image_pull_policy ([#1533](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1533)) ([4e9f133](https://github.com/chanzuckerberg/cryoet-data-portal/commit/4e9f133473dfb3e58d1100de48dfea46f9161c45))

## [1.45.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.45.0...web-v1.45.1) (2025-01-24)


### 🐞 Bug Fixes

* Fix hydration errors throughout app ([#1507](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1507)) ([fd44d14](https://github.com/chanzuckerberg/cryoet-data-portal/commit/fd44d1416a9303354e2cdbd032900b2e1c64b586))
* Model/weight method links not properly rendered ([#1509](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1509)) ([4f967c0](https://github.com/chanzuckerberg/cryoet-data-portal/commit/4f967c0a8502bc28e2740f2d4f433dbb299dd8cb))
* Remove time zones from tomogram date fields ([#1511](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1511)) ([76c4b05](https://github.com/chanzuckerberg/cryoet-data-portal/commit/76c4b053bc1fa5ef149428077b942b58380b6d82))

## [1.45.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.44.0...web-v1.45.0) (2025-01-23)


### ✨ Features

* Migrate datasets and deposition filter values to use V2 data ([#1502](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1502)) ([f338feb](https://github.com/chanzuckerberg/cryoet-data-portal/commit/f338febe9114aaf9f016b45d482d1db0ba433883))
* Migrate rest of dataset page to use V2 data ([#1499](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1499)) ([8aad11e](https://github.com/chanzuckerberg/cryoet-data-portal/commit/8aad11eb58bbe1a03ff8feaf2fe5f27ceb226c9d))


### 🐞 Bug Fixes

* Convert null to false for annotation authors in run page differ ([#1506](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1506)) ([50ced05](https://github.com/chanzuckerberg/cryoet-data-portal/commit/50ced05a3a997d11b1bfab04a0b2940e4334475c))
* More adjustments to run query differ ([#1501](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1501)) ([4b8f40b](https://github.com/chanzuckerberg/cryoet-data-portal/commit/4b8f40b3447e6aefb5be8d491e6493c09ae072ef))

## [1.44.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.43.0...web-v1.44.0) (2025-01-21)


### ✨ Features

* Add aggregate filters to datasets and deposition queries ([#1470](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1470)) ([7fdd048](https://github.com/chanzuckerberg/cryoet-data-portal/commit/7fdd0485a4ba2f78dd3d49de637f51f5a6d50eac))
* Diff logging for deposition page ([#1467](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1467)) ([3947969](https://github.com/chanzuckerberg/cryoet-data-portal/commit/39479692f464953c1e8a54330d5729edadc66c0d))


### 🐞 Bug Fixes

* Run page differ fixes to handle BE edge cases/bugs ([#1498](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1498)) ([69125a9](https://github.com/chanzuckerberg/cryoet-data-portal/commit/69125a95af416dd5995cf8a90503d6750084b44e))

## [1.43.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.42.0...web-v1.43.0) (2025-01-16)


### ✨ Features

* Another dummy PR ([#1473](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1473)) ([1f8fd97](https://github.com/chanzuckerberg/cryoet-data-portal/commit/1f8fd976f958f995757acbab504840a5fa67521f))

## [1.42.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.41.0...web-v1.42.0) (2025-01-15)


### ✨ Features

* Dummy PR to trigger release please ([#1471](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1471)) ([212cff1](https://github.com/chanzuckerberg/cryoet-data-portal/commit/212cff1a7640bf51f48a2bf4b9a0adef0a8f7565))

## [1.41.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.40.0...web-v1.41.0) (2025-01-14)


### ✨ Features

* Convert deposition page query to V2 ([#1452](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1452)) ([c55bad8](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c55bad82130062a135ad876e82385ac44e848963))
* Update ML Challenge banner ([#1457](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1457)) ([d873866](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d873866cdb478de0d8c5682fd5534535f3b2d40b))


### 🐞 Bug Fixes

* Fix deposition filter on run page ([#1466](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1466)) ([0f26b64](https://github.com/chanzuckerberg/cryoet-data-portal/commit/0f26b64476cd1670055cc2e7ff9d6de8de58131a))


### 🧹 Miscellaneous Chores

* Refactor datasets filter values fragment ([#1456](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1456)) ([4e3c156](https://github.com/chanzuckerberg/cryoet-data-portal/commit/4e3c156aae40bed62d3bdc5a519f8f33ef13509c))

## [1.40.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.39.0...web-v1.40.0) (2025-01-09)


### ✨ Features

* Add diff detection for new datasets page query ([#1446](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1446)) ([2ac96b6](https://github.com/chanzuckerberg/cryoet-data-portal/commit/2ac96b63c2980ed4af3a8cc818c825bea9ae5bfd))
* Migrate datasets page query ([#1438](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1438)) ([d634ebd](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d634ebd72d6f907b06586a58b6977f2f803a2b07))


### 🐞 Bug Fixes

* Fix deposition dropdown filters being broken ([#1448](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1448)) ([3257850](https://github.com/chanzuckerberg/cryoet-data-portal/commit/325785055627343b2b3f97143d5ede4ae07b29cd))
* Never send empty argument objects to APIv2 ([#1447](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1447)) ([2087cf6](https://github.com/chanzuckerberg/cryoet-data-portal/commit/2087cf676b8fd46ae39ecf39e5846e825895e574))
* Remove non-null assertions in dataset page hook ([#1450](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1450)) ([8d258b7](https://github.com/chanzuckerberg/cryoet-data-portal/commit/8d258b73c1d5f535c08ecab1070e82504ccf79fb))


### 🧪 Tests

* filter components unit tests ([#1436](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1436)) ([1acbf30](https://github.com/chanzuckerberg/cryoet-data-portal/commit/1acbf3074de170ea8891fd6bb07b5cbba64b45e0))

## [1.39.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.38.0...web-v1.39.0) (2025-01-03)


### ✨ Features

* Use V2 aggregate data in run page ([#1429](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1429)) ([f7754e4](https://github.com/chanzuckerberg/cryoet-data-portal/commit/f7754e4d88e20232f4456e61b51205727b90c1f8))


### 🧹 Miscellaneous Chores

* Remove Multiple Tomograms flag ([#1434](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1434)) ([531ece1](https://github.com/chanzuckerberg/cryoet-data-portal/commit/531ece1e955f936893e72a3184d7da3d723c4ecf))

## [1.38.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.37.2...web-v1.38.0) (2025-01-02)


### ✨ Features

* Add deposition to V2 run query ([#1424](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1424)) ([2632ac0](https://github.com/chanzuckerberg/cryoet-data-portal/commit/2632ac0b7f8ddedfce50dc8dfa4b2e0fc3b4fb9b))
* Add diff logging for dataset page ([#1419](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1419)) ([4ee07f7](https://github.com/chanzuckerberg/cryoet-data-portal/commit/4ee07f7f183d7fed8dbdfb51f600cd90cb8825e9))
* Add V2 query for dataset page ([#1409](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1409)) ([36ba07f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/36ba07f8c650070caaa5e337b029b3666c8ae4db))
* Finish converting run page query to V2 ([#1425](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1425)) ([c46b9e5](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c46b9e537121e4b14a4ee6dbab21c123a04a215b))
* Use some V2 fields in dataset page ([#1427](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1427)) ([bec698e](https://github.com/chanzuckerberg/cryoet-data-portal/commit/bec698e6a391012f82c9c482196bbe06ac5c25c6))


### 🐞 Bug Fixes

* Fix affine transformation matrix diff log ([#1422](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1422)) ([9b823e1](https://github.com/chanzuckerberg/cryoet-data-portal/commit/9b823e1fdb678df075e26209b28ad85287635cd7))
* Fix more run page diff logs ([#1414](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1414)) ([78b8fa9](https://github.com/chanzuckerberg/cryoet-data-portal/commit/78b8fa98696c0f2a3668e2aacb691ef4f4e6f00c))
* Fix run query diff logging ([#1405](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1405)) ([7179752](https://github.com/chanzuckerberg/cryoet-data-portal/commit/71797529b5114157979683aef35abcab9d014903))


### 🧪 Tests

* unit tests feature components ([#1423](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1423)) ([2473e30](https://github.com/chanzuckerberg/cryoet-data-portal/commit/2473e3029aa64ed5764afc516f4ae6184a276783))

## [1.37.2](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.37.1...web-v1.37.2) (2024-12-17)


### 🧪 Tests

* simple component unit tests ([#1392](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1392)) ([45e214e](https://github.com/chanzuckerberg/cryoet-data-portal/commit/45e214e1b02970edf795de5392709e0be23f959c))

## [1.37.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.37.0...web-v1.37.1) (2024-12-11)


### 🐞 Bug Fixes

* Small tweaks to fix landing page responsiveness on mobile ([#1385](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1385)) ([225c59b](https://github.com/chanzuckerberg/cryoet-data-portal/commit/225c59b097ec5082932b822fdb80d94fb0eea2aa))

## [1.37.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.36.1...web-v1.37.0) (2024-12-05)


### ✨ Features

* api migration for browse all depositions page ([#1357](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1357)) ([dbec885](https://github.com/chanzuckerberg/cryoet-data-portal/commit/dbec885109a1d9726673462989d0edac92a26d22))
* api migration setup ([#1356](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1356)) ([72af8e9](https://github.com/chanzuckerberg/cryoet-data-portal/commit/72af8e947d71853643cc6e60b9ce84c89daf00d2))


### 🧹 Miscellaneous Chores

* update survey banner copy ([#1371](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1371)) ([286572c](https://github.com/chanzuckerberg/cryoet-data-portal/commit/286572c0221c401d55f9467e5d4eadb1156510d1))

## [1.36.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.36.0...web-v1.36.1) (2024-11-27)


### 🐞 Bug Fixes

* duplicate funding agencies ([#1365](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1365)) ([544297c](https://github.com/chanzuckerberg/cryoet-data-portal/commit/544297ce7ac050359a58be014df6feeb70b5ecb1))
* fix datasets with deposition data typo ([#1358](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1358)) ([c5033c4](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c5033c47049221707da8568042f23afe35886524))
* Modifier (cmd, shift, ctrl) clicking on `BaseLink` Links modifies current page view & url  ([#1335](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1335)) ([aed70fb](https://github.com/chanzuckerberg/cryoet-data-portal/commit/aed70fb1482afce04eb5a14524f1b8b700b2754b))


### 🧹 Miscellaneous Chores

* update deps ([#1361](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1361)) ([d9f6635](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d9f6635f619932a4a1e747224075d0d56a2d6a70))

## [1.36.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.35.1...web-v1.36.0) (2024-11-06)


### ✨ Features

* challenge status banner ([#1319](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1319)) ([1bd0bff](https://github.com/chanzuckerberg/cryoet-data-portal/commit/1bd0bffae24504b45f2336ac6c9566ae7cde9605))
* definition and search updates ([#1298](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1298)) ([58e36ea](https://github.com/chanzuckerberg/cryoet-data-portal/commit/58e36eaffb53422e4796254ec907fe2c15aa73b7))
* ML challenge launch copy updates ([#1318](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1318)) ([7ceff67](https://github.com/chanzuckerberg/cryoet-data-portal/commit/7ceff673ce225132057dd9b726ba22aad6032677))
* order datasets by release date ([#1320](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1320)) ([788c178](https://github.com/chanzuckerberg/cryoet-data-portal/commit/788c178157c7115b389f0d50ddec221b6e92df37))
* universal empty states ([#1295](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1295)) ([ef64faa](https://github.com/chanzuckerberg/cryoet-data-portal/commit/ef64faa5d46ba824abb27063b3978352446e3f4d))


### 🐞 Bug Fixes

* download code snippets ([#1315](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1315)) ([b137eb4](https://github.com/chanzuckerberg/cryoet-data-portal/commit/b137eb47850542399a50f0a0f3e8f04d77f8876a))
* fix single run page view tomogram button ([#1325](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1325)) ([da6902c](https://github.com/chanzuckerberg/cryoet-data-portal/commit/da6902c909b196d6da69437510c8a3eec37fe2b8))
* fix view tomogram button greyed out error ([#1323](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1323)) ([5a6ca7a](https://github.com/chanzuckerberg/cryoet-data-portal/commit/5a6ca7a53b138a9914098c74f31e555b89caba3f))
* table hover state ([#1300](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1300)) ([800ad33](https://github.com/chanzuckerberg/cryoet-data-portal/commit/800ad330e4673235eb7b8b1e3275612c8c163617))


### 🧹 Miscellaneous Chores

* fix ml challenge page nits ([#1324](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1324)) ([9ba9fa7](https://github.com/chanzuckerberg/cryoet-data-portal/commit/9ba9fa7a489eb36a2674d6cfce15cb88cfb7f3f2))

## [1.35.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.35.0...web-v1.35.1) (2024-11-05)


### 🐞 Bug Fixes

* header dropdown misplacement on icon click ([#1297](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1297)) ([8ecb914](https://github.com/chanzuckerberg/cryoet-data-portal/commit/8ecb914059c7e99dd726419c781985d3131a4fa7))
* sort tiltseries quality filter scores ([#1296](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1296)) ([aa2b28f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/aa2b28f64a874f8e920d91cfefce1cc4165f0dac))

## [1.35.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.34.1...web-v1.35.0) (2024-10-30)


### ✨ Features

* plausible analytics for depositions ([#1273](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1273)) ([319d8f6](https://github.com/chanzuckerberg/cryoet-data-portal/commit/319d8f6f9cbf5570e0796d720377b2131af6a607))

## [1.34.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.34.0...web-v1.34.1) (2024-10-28)


### 🐞 Bug Fixes

* tomogram table alignment ([#1281](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1281)) ([f57e3fb](https://github.com/chanzuckerberg/cryoet-data-portal/commit/f57e3fb095f23e50abca1ee9d348e57b64fcb86e))

## [1.34.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.33.2...web-v1.34.0) (2024-10-28)


### ✨ Features

* enable multiple tomograms ([#1279](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1279)) ([34d993d](https://github.com/chanzuckerberg/cryoet-data-portal/commit/34d993dbe55dde0feca17be820a850e8a73c383a))

## [1.33.2](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.33.1...web-v1.33.2) (2024-10-28)


### 🐞 Bug Fixes

* address misc UXR recommdations ([#1264](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1264)) ([ad55a4c](https://github.com/chanzuckerberg/cryoet-data-portal/commit/ad55a4c4b011d40b28d7a4da91a9e27b016baf45))

## [1.33.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.33.0...web-v1.33.1) (2024-10-23)


### 🐞 Bug Fixes

* address multiple tomograms feedback ([#1261](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1261)) ([fce77ad](https://github.com/chanzuckerberg/cryoet-data-portal/commit/fce77ad01d0d0c3cb9e339db0af2ed7843bb87c4))
* carry over multiple params ([#1252](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1252)) ([3c86411](https://github.com/chanzuckerberg/cryoet-data-portal/commit/3c86411057ad554e5f22e11f106a6e25c435f6b5))
* view tomogram open in  new tab ([#1251](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1251)) ([3312884](https://github.com/chanzuckerberg/cryoet-data-portal/commit/3312884a555a3d56283f6c3c03ccc4c9fa8b85a2))


### 📝 Documentation

* Fix portal links ([#1256](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1256)) ([3a76bcf](https://github.com/chanzuckerberg/cryoet-data-portal/commit/3a76bcf0829e246aebc2efa770e5dcbf28447958))

## [1.33.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.32.1...web-v1.33.0) (2024-10-16)


### ✨ Features

* multiple tomogram use api v2 ([#1234](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1234)) ([858d815](https://github.com/chanzuckerberg/cryoet-data-portal/commit/858d815beebe83adea8d53549c5960190c2d637f))

## [1.32.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.32.0...web-v1.32.1) (2024-10-08)


### 🐞 Bug Fixes

* support changed field name ([#1218](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1218)) ([c0684b8](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c0684b86e5e54a313f6533065d7e71b1718e940b))

## [1.32.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.31.0...web-v1.32.0) (2024-10-03)


### ✨ Features

* Add disabled download option states ([#1197](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1197)) ([f904258](https://github.com/chanzuckerberg/cryoet-data-portal/commit/f9042585247abf97ca6d48bc0086db4b0dba7273))
* Misc copy fixes ([#1210](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1210)) ([2da6755](https://github.com/chanzuckerberg/cryoet-data-portal/commit/2da6755f22794b319a064eb210962f2a8e0b6fec))

## [1.31.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.30.0...web-v1.31.0) (2024-10-03)


### ✨ Features

* Add portal standard badge to tomograms table and integrate alignment metadata accordion with new API ([#1179](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1179)) ([1de70a1](https://github.com/chanzuckerberg/cryoet-data-portal/commit/1de70a1befac558934958d92d4b433e9d2f7e909))
* Add standard tomogram badge to tomogram selector ([#1181](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1181)) ([ac4ad27](https://github.com/chanzuckerberg/cryoet-data-portal/commit/ac4ad276d8d1f874ec640ff0f79c7c0374c443c3))
* Add tooltip to Alignment ID field in tomogram sidebar ([#1196](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1196)) ([fad5207](https://github.com/chanzuckerberg/cryoet-data-portal/commit/fad5207e6c9f4244f6116fa5b083244f8835c56e))
* Integrate more V2 API queries ([#1174](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1174)) ([92f80a7](https://github.com/chanzuckerberg/cryoet-data-portal/commit/92f80a73c6dcaa2ab875eef8ac67bff9814a788c))
* Migrate and start using tomograms query in UI ([#1169](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1169)) ([d21ffd9](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d21ffd930424c6244605d36b7a1cfab86559cff3))
* Undo changes for transforming annotations and add new callout for mismatched alignments ([#1191](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1191)) ([ea1598d](https://github.com/chanzuckerberg/cryoet-data-portal/commit/ea1598d3cafc4a72e0e2eddb319b1a5fdfe786ec))
* update annotation row name ([#1163](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1163)) ([6164201](https://github.com/chanzuckerberg/cryoet-data-portal/commit/61642016fd90f8b64f6a0d94d7885be07f5bb871))
* Update to generic annotation transformation callout during download ([#1186](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1186)) ([5597524](https://github.com/chanzuckerberg/cryoet-data-portal/commit/55975247a151c82114392fcab8c57b3abcb674ff))


### 🐞 Bug Fixes

* address misc UI/UX bugs ([#1192](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1192)) ([178737d](https://github.com/chanzuckerberg/cryoet-data-portal/commit/178737d4e8fa773b8dc02c3fc6c1a0d186e08e88))
* change incorrect deposition links ([#1133](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1133)) ([dc642e5](https://github.com/chanzuckerberg/cryoet-data-portal/commit/dc642e5010e0723afe475ec61234f218c92c4803))
* Stop querying depositionTitle ([#1187](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1187)) ([07a08d4](https://github.com/chanzuckerberg/cryoet-data-portal/commit/07a08d43e409c0de905286b172bd5f0580e9d5f6))


### 🧹 Miscellaneous Chores

* prefix IDs across the portal ([#1178](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1178)) ([1732fb2](https://github.com/chanzuckerberg/cryoet-data-portal/commit/1732fb22929b6106a14e4c18d061bc40f5eca33b))

## [1.30.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.29.0...web-v1.30.0) (2024-09-23)


### ✨ Features

* Add alignment ID row + tooltip ([#1153](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1153)) ([1227fbb](https://github.com/chanzuckerberg/cryoet-data-portal/commit/1227fbb09037ab243f9b2723bbf6378ff6faabe9))
* Add annotations and tomograms tables empty states ([#1155](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1155)) ([bad73bb](https://github.com/chanzuckerberg/cryoet-data-portal/commit/bad73bb778a2fd27fd359e7e9045c60f9663291e))
* Add more V2 API fields ([#1166](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1166)) ([0770a16](https://github.com/chanzuckerberg/cryoet-data-portal/commit/0770a16bbe7b4f6a05c0b7cad71557ab2840483f))
* Add reference tomogram selector for single annotation download ([#1136](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1136)) ([d1f694a](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d1f694ad25338c0cd0dd4ce08e7aedb8b1850ca0))
* make ML Challenge Page mobile friendly ([#1141](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1141)) ([c25ceeb](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c25ceeb2e79b4770e4999d1eb385b457c892b790))
* Stop querying publications in V2 temporarily ([#1160](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1160)) ([469b9b8](https://github.com/chanzuckerberg/cryoet-data-portal/commit/469b9b8eff0d7fe3d2de3e436d5f4f83262949e1))
* Update view tomogram button icons ([#1170](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1170)) ([087d1aa](https://github.com/chanzuckerberg/cryoet-data-portal/commit/087d1aa7129bcc604c064136ad38d891b8c80f20))
* upgrade sds ([#1077](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1077)) ([d56d716](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d56d716700ec6c8225a9807642137944b454e8cf))
* upgrade sds colors ([#1078](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1078)) ([75ebe8b](https://github.com/chanzuckerberg/cryoet-data-portal/commit/75ebe8bcfab46055ca6d2182bac50493dae2a5d6))

## [1.29.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.28.0...web-v1.29.0) (2024-09-18)


### ✨ Features

* Change download all annotations copy ([#1151](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1151)) ([3d35246](https://github.com/chanzuckerberg/cryoet-data-portal/commit/3d35246dbd7055dc4b040ff580fc12a826c5c204)), closes [#1045](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1045)
* Start writing run query for new API ([#1149](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1149)) ([6a5eff1](https://github.com/chanzuckerberg/cryoet-data-portal/commit/6a5eff12836093d0f10810aa114e5b94542a4236))

## [1.28.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.27.0...web-v1.28.0) (2024-09-16)


### ✨ Features

* Descriptions of datasets and depositions. ([#1134](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1134)) ([6f2d66f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/6f2d66f531bf51037f99aedcd1e00d2ad9af3567))
* filter carry over behavior ([#1128](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1128)) ([afd3497](https://github.com/chanzuckerberg/cryoet-data-portal/commit/afd3497ef83a3a7e6c43b6def943e76dc7b11022))
* Prep FE codebase for 2 API URLs ([#1126](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1126)) ([e76f270](https://github.com/chanzuckerberg/cryoet-data-portal/commit/e76f27086c0271a1189e242cd0f464c62f1e61f3))


### 🐞 Bug Fixes

* Fix not enough padding below key photos ([#1140](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1140)) ([6e84e51](https://github.com/chanzuckerberg/cryoet-data-portal/commit/6e84e51ec69a0a0b1dd994f09e4cf0355bb45464))

## [1.27.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.26.1...web-v1.27.0) (2024-09-11)


### ✨ Features

* Id prefixes in filters ([#1124](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1124)) ([d62f382](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d62f382a4f983e85247db14f9b7ec1e8e5a551cc))
* Implement new single tomogram download flow ([#1120](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1120)) ([721b7db](https://github.com/chanzuckerberg/cryoet-data-portal/commit/721b7db5026ee8cfee5b89be124f119b1a802cb0))
* integrate depositions backend ([#1093](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1093)) ([63c1b5d](https://github.com/chanzuckerberg/cryoet-data-portal/commit/63c1b5ddf26886bfa8220545c66e2bb37f97d039))


### 🐞 Bug Fixes

* header key photo sizing ([#1117](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1117)) ([38ad6f2](https://github.com/chanzuckerberg/cryoet-data-portal/commit/38ad6f2f73452cde499f42611ec9c6250b372277))

## [1.26.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.26.0...web-v1.26.1) (2024-09-09)


### 🧹 Miscellaneous Chores

* Leave comments about not refactoring pagination tests ([#1121](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1121)) ([fafac8a](https://github.com/chanzuckerberg/cryoet-data-portal/commit/fafac8a35484222201c45aed0f5c23e9db2de232))

## [1.26.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.25.0...web-v1.26.0) (2024-09-05)


### ✨ Features

* add deposition related filters ([#1079](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1079)) ([ffec095](https://github.com/chanzuckerberg/cryoet-data-portal/commit/ffec095058ddd38920e4d848f0e3c47dee1ed324))
* Add metadata sidebar for tomogram ([#1112](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1112)) ([39351f0](https://github.com/chanzuckerberg/cryoet-data-portal/commit/39351f07f916b6c487487e137a84faa9da7b3ad6))
* Add Tomograms Summary to run sidebar ([#1094](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1094)) ([5a3132a](https://github.com/chanzuckerberg/cryoet-data-portal/commit/5a3132a962b70a4f23291d908b60ad3865f1eea2))
* deposition filter banner ([#1040](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1040)) ([bb83312](https://github.com/chanzuckerberg/cryoet-data-portal/commit/bb8331236a1c67b9a812712f08f97a35fbc4d8c7))
* info panel deposition metadata ([#1092](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1092)) ([01a8b67](https://github.com/chanzuckerberg/cryoet-data-portal/commit/01a8b6732fac7e890e6f9efc3a202cec3a20f562))
* Make main photo HTML and CSS consistent between run and dataset pages ([#1096](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1096)) ([6a88242](https://github.com/chanzuckerberg/cryoet-data-portal/commit/6a88242320b5014b2bed5f4435e9fe14158007bd))
* More updates to tomograms table ([#1106](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1106)) ([a6ef66e](https://github.com/chanzuckerberg/cryoet-data-portal/commit/a6ef66eaa35844dc4dee6d23aeeadb8c6da9a460))
* View Tomogram tooltips + button changes ([#1089](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1089)) ([54b4fe5](https://github.com/chanzuckerberg/cryoet-data-portal/commit/54b4fe5715fd0fa6dd6efe1d01fefccba33232be))


### 🐞 Bug Fixes

* Carry over filters from datasets table ([#1113](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1113)) ([b3c8628](https://github.com/chanzuckerberg/cryoet-data-portal/commit/b3c862818fd7d642c973d3efc9ba4ff38ef10115))
* Disable Apollo Client cache on the server ([#1088](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1088)) ([373b987](https://github.com/chanzuckerberg/cryoet-data-portal/commit/373b987f816622140a226f9a12549004e9b03146)), closes [#1041](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1041)


### ⚙ Continuous Integration

* add missing skip e2e ([#1116](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1116)) ([ee6064a](https://github.com/chanzuckerberg/cryoet-data-portal/commit/ee6064a7f66eec3f2e753bac606652010b448899))
* skip e2e if feature disabled ([#1114](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1114)) ([b5cb014](https://github.com/chanzuckerberg/cryoet-data-portal/commit/b5cb014ea6c8d3a6f0b4f7e102a5353c365e8cb2))

## [1.25.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.24.0...web-v1.25.0) (2024-08-22)


### ✨ Features

* annotation GO ID -&gt; annotation Object ID: add UniProtKB support to annotation Object IDs ([#1068](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1068)) ([58b5bf9](https://github.com/chanzuckerberg/cryoet-data-portal/commit/58b5bf968733985001242bb5a1330fc7b369f090))


### 🐞 Bug Fixes

* ID detection for annotation object id link  ([#1075](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1075)) ([dc4fd8f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/dc4fd8fb2a92187ab2bfa507e538a066227eb2c9))

## [1.24.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.23.1...web-v1.24.0) (2024-08-22)


### ✨ Features

* add single deposition info panel ([#986](https://github.com/chanzuckerberg/cryoet-data-portal/issues/986)) ([62fb35f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/62fb35fe2a59215387c29e36cfb62d1b6ed7a9a9))


### ⚙ Continuous Integration

* fixes prod e2e tests ([#1066](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1066)) ([de5e273](https://github.com/chanzuckerberg/cryoet-data-portal/commit/de5e2738541c163a80442b394c10a8dac967a794))

## [1.23.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.23.0...web-v1.23.1) (2024-08-20)


### 🐞 Bug Fixes

* wrap collapsible lists in a div ([#1038](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1038)) ([4df83f0](https://github.com/chanzuckerberg/cryoet-data-portal/commit/4df83f060227d6d0cc81ff0806aea333f19866b9))

## [1.23.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.22.0...web-v1.23.0) (2024-08-20)


### ✨ Features

* deposition breadcrumb behavior ([#1036](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1036)) ([3d8c0d5](https://github.com/chanzuckerberg/cryoet-data-portal/commit/3d8c0d56e041453b92933d6e761c31be7119d440))
* Fix/clean up tomogram_stats query ([#1033](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1033)) ([2d54a0c](https://github.com/chanzuckerberg/cryoet-data-portal/commit/2d54a0cfffbc06f2b0795eb5fb8f6c2a361b868c))

## [1.22.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.21.0...web-v1.22.0) (2024-08-16)


### ✨ Features

* add filter panel to single deposition page ([#1030](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1030)) ([d378e7c](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d378e7c2be0c51595bef36ab2adde0647145ce95))

## [1.21.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.20.0...web-v1.21.0) (2024-08-15)


### ✨ Features

* Update Tomogram Processing field format and query ([#1031](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1031)) ([80e1b51](https://github.com/chanzuckerberg/cryoet-data-portal/commit/80e1b51995094f2ee42768c36e6499d11be5b936))

## [1.20.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.19.1...web-v1.20.0) (2024-08-15)


### ✨ Features

* Implement collapsing Annotated Objects list ([#1024](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1024)) ([9343d12](https://github.com/chanzuckerberg/cryoet-data-portal/commit/9343d1215a60632696efba551c9272aa7ce98b85))


### 🧹 Miscellaneous Chores

* Add e2e test for errors on Neuroglancer site ([#1027](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1027)) ([572972d](https://github.com/chanzuckerberg/cryoet-data-portal/commit/572972d915a20338d9a4a59742233f855e3720c8))

## [1.19.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.19.0...web-v1.19.1) (2024-08-13)


### 🐞 Bug Fixes

* Dedupe authors ([#1018](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1018)) ([bdbc034](https://github.com/chanzuckerberg/cryoet-data-portal/commit/bdbc034dd20d9db42536e8a84e312545148e6a55)), closes [#752](https://github.com/chanzuckerberg/cryoet-data-portal/issues/752)
* Fix Neuroglancer URL bug ([#1026](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1026)) ([377d6dc](https://github.com/chanzuckerberg/cryoet-data-portal/commit/377d6dcd38870190601ac28d8ddd695f2e8adfb5)), closes [#1025](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1025)

## [1.19.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.18.0...web-v1.19.0) (2024-08-12)


### ✨ Features

* Add Tomograms table ([#988](https://github.com/chanzuckerberg/cryoet-data-portal/issues/988)) ([420acdd](https://github.com/chanzuckerberg/cryoet-data-portal/commit/420acdd2999e4261214a9475c9a6d37b1c85ef28))
* Enable pagination of Annotations table with temporary hacky query ([#992](https://github.com/chanzuckerberg/cryoet-data-portal/issues/992)) ([79f7247](https://github.com/chanzuckerberg/cryoet-data-portal/commit/79f724798caacab162eb89a0a4ce57a7b19f5e2d))


### ♻️ Code Refactoring

* download dialog tests ([#1011](https://github.com/chanzuckerberg/cryoet-data-portal/issues/1011)) ([f0ece55](https://github.com/chanzuckerberg/cryoet-data-portal/commit/f0ece552004cad1d3847691aab0bfd8b0ab6b8e3)), closes [#962](https://github.com/chanzuckerberg/cryoet-data-portal/issues/962)

## [1.18.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.17.0...web-v1.18.0) (2024-08-02)


### ✨ Features

* Add Tomograms tab to Run page ([#983](https://github.com/chanzuckerberg/cryoet-data-portal/issues/983)) ([c357e6e](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c357e6e804ac31a854a5012295a459c3be19e6e6))

## [1.17.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.16.0...web-v1.17.0) (2024-07-31)


### ✨ Features

* Update cell strain links. ([#968](https://github.com/chanzuckerberg/cryoet-data-portal/issues/968)) ([df43bd6](https://github.com/chanzuckerberg/cryoet-data-portal/commit/df43bd68953557c64fa311c9ce417c027acda486))


### 🐞 Bug Fixes

* avoid double-encoding spaces in breadcrumb url ([#970](https://github.com/chanzuckerberg/cryoet-data-portal/issues/970)) ([8b8a4b4](https://github.com/chanzuckerberg/cryoet-data-portal/commit/8b8a4b4fdedc46b65f86ab2353885151cd53b851))

## [1.16.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.15.0...web-v1.16.0) (2024-07-29)


### ✨ Features

* Add ground truth dividers to Annotations table and correct all annotation counts ([#949](https://github.com/chanzuckerberg/cryoet-data-portal/issues/949)) ([6c238dc](https://github.com/chanzuckerberg/cryoet-data-portal/commit/6c238dc74f82a2f3ed00734ea3cc0c92ddeeae04))


### 🐞 Bug Fixes

* Fix merge conflict on depositions page ([#959](https://github.com/chanzuckerberg/cryoet-data-portal/issues/959)) ([655dd44](https://github.com/chanzuckerberg/cryoet-data-portal/commit/655dd44b025b1343a03146744e44728e55ce87bf))
* repeated annotated object names ([#958](https://github.com/chanzuckerberg/cryoet-data-portal/issues/958)) ([7d039d8](https://github.com/chanzuckerberg/cryoet-data-portal/commit/7d039d8b10b1b574bf1f4f4466c2cd0de4d7547a))


### ♻️ Code Refactoring

* filter tests ([#952](https://github.com/chanzuckerberg/cryoet-data-portal/issues/952)) ([53f348a](https://github.com/chanzuckerberg/cryoet-data-portal/commit/53f348a5d93f7a85a815eb4885526cc62ce882a5))

## [1.15.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.14.0...web-v1.15.0) (2024-07-26)


### ✨ Features

* single deposition page overview + table ([#840](https://github.com/chanzuckerberg/cryoet-data-portal/issues/840)) ([e48096b](https://github.com/chanzuckerberg/cryoet-data-portal/commit/e48096bc91c3c7e44911b7fe7f3d77e6e4a5c158))

## [1.14.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.13.1...web-v1.14.0) (2024-07-25)


### ✨ Features

* Refactor &lt;TablePageLayout&gt; to support multiple tabs ([#911](https://github.com/chanzuckerberg/cryoet-data-portal/issues/911)) ([659bea3](https://github.com/chanzuckerberg/cryoet-data-portal/commit/659bea3fb316b88927b4f215a9e5b9286f5e0bb9))

## [1.13.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.13.0...web-v1.13.1) (2024-07-25)


### 🐞 Bug Fixes

* mdx page dates ([#914](https://github.com/chanzuckerberg/cryoet-data-portal/issues/914)) ([85b02a2](https://github.com/chanzuckerberg/cryoet-data-portal/commit/85b02a2b1f5afc66fef2ae6c8d016d0c4537ccde))


### ♻️ Code Refactoring

* filter tests page object model ([#885](https://github.com/chanzuckerberg/cryoet-data-portal/issues/885)) ([df26183](https://github.com/chanzuckerberg/cryoet-data-portal/commit/df26183b643c59b74d1273050e9efcbe36b57d16))

## [1.13.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.12.4...web-v1.13.0) (2024-07-18)


### ✨ Features

* Add multiple tomograms feature flag and gate run header changes by it ([#886](https://github.com/chanzuckerberg/cryoet-data-portal/issues/886)) ([f65fa0c](https://github.com/chanzuckerberg/cryoet-data-portal/commit/f65fa0c5caaa9f417f454c42fb7713078398ea61))


### 🐞 Bug Fixes

* Don't add annotation rows for shape types that are filtered out ([#892](https://github.com/chanzuckerberg/cryoet-data-portal/issues/892)) ([6a38f11](https://github.com/chanzuckerberg/cryoet-data-portal/commit/6a38f11afe46213e247d204a272d6b49165e097b))

## [1.12.4](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.12.3...web-v1.12.4) (2024-07-16)


### 🐞 Bug Fixes

* Remove citations field from dataset metadata drawer ([#874](https://github.com/chanzuckerberg/cryoet-data-portal/issues/874)) ([06b6a3d](https://github.com/chanzuckerberg/cryoet-data-portal/commit/06b6a3d50226b6a76a32b8498292b1d1f3529432))


### 🧹 Miscellaneous Chores

* add hygen ([#877](https://github.com/chanzuckerberg/cryoet-data-portal/issues/877)) ([26efe1f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/26efe1f44409e4ada7ca248fdff40e7e31664196))

## [1.12.3](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.12.2...web-v1.12.3) (2024-07-12)


### 🐞 Bug Fixes

* CSS tweaks to labels ([#871](https://github.com/chanzuckerberg/cryoet-data-portal/issues/871)) ([b7c0d34](https://github.com/chanzuckerberg/cryoet-data-portal/commit/b7c0d3477adaf6a4c3bf546b98a5dc4ee27d8c44))


### ♻️ Code Refactoring

* using page object model for e2e tests ([#856](https://github.com/chanzuckerberg/cryoet-data-portal/issues/856)) ([a72835f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/a72835fe78fa3ee1ecc064305362a0303d55c4eb))


### ⚙ Continuous Integration

* add E2E tests for single run page filters ([#807](https://github.com/chanzuckerberg/cryoet-data-portal/issues/807)) ([c7582f0](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c7582f0bb59317f97f5050312ccb6a41950ebbbc))

## [1.12.2](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.12.1...web-v1.12.2) (2024-07-10)


### 🐞 Bug Fixes

* stop capitalizing annotation object display ([#861](https://github.com/chanzuckerberg/cryoet-data-portal/issues/861)) ([1781c72](https://github.com/chanzuckerberg/cryoet-data-portal/commit/1781c72827d48636dacc262fdc0057f7b1582c45))

## [1.12.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.12.0...web-v1.12.1) (2024-07-09)


### ⚙ Continuous Integration

* fix metadata drawer e2e ([#851](https://github.com/chanzuckerberg/cryoet-data-portal/issues/851)) ([b2deb9f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/b2deb9fded6d3072a2b4c76643c29056f3612052))

## [1.12.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.11.1...web-v1.12.0) (2024-07-09)


### ✨ Features

* Update annotation method type tooltips text ([#847](https://github.com/chanzuckerberg/cryoet-data-portal/issues/847)) ([c42fd9d](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c42fd9d06a34f327d2dcc209d3062c23d7766692))


### 🐞 Bug Fixes

* change Empiar to EMPIAR ([#838](https://github.com/chanzuckerberg/cryoet-data-portal/issues/838)) ([e53e91c](https://github.com/chanzuckerberg/cryoet-data-portal/commit/e53e91ce747187d4975a982af292bfb34bf51c80))
* Increase width for tilt series quality score column. ([#846](https://github.com/chanzuckerberg/cryoet-data-portal/issues/846)) ([0426615](https://github.com/chanzuckerberg/cryoet-data-portal/commit/0426615089d88c73555639900f1db39ac7f26b30))
* Remove erroneous horizontal overflows from various places ([#837](https://github.com/chanzuckerberg/cryoet-data-portal/issues/837)) ([c9262fa](https://github.com/chanzuckerberg/cryoet-data-portal/commit/c9262fa6006e3e33cfd65439e9fa6999cfd0140a))
* update download button strings ([#841](https://github.com/chanzuckerberg/cryoet-data-portal/issues/841)) ([76daa57](https://github.com/chanzuckerberg/cryoet-data-portal/commit/76daa5741896623d3c4ca68dc1a6cf57a2f20c99))


### 🧹 Miscellaneous Chores

* Fix metadata test ([#839](https://github.com/chanzuckerberg/cryoet-data-portal/issues/839)) ([d9bcaa6](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d9bcaa66c9dea82900a4b1452d6119da331c26ee))

## [1.11.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.11.0...web-v1.11.1) (2024-07-01)


### ⚙ Continuous Integration

* metadata drawer e2e ([#823](https://github.com/chanzuckerberg/cryoet-data-portal/issues/823)) ([db612e7](https://github.com/chanzuckerberg/cryoet-data-portal/commit/db612e778106bce69de64f5cfc885a5ccc5e0748))

## [1.11.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.10.4...web-v1.11.0) (2024-06-27)


### ✨ Features

* add skeleton for browse depositions page ([#822](https://github.com/chanzuckerberg/cryoet-data-portal/issues/822)) ([ac20c18](https://github.com/chanzuckerberg/cryoet-data-portal/commit/ac20c18ac54e57d3707de3e12f66c7b4a23be9cb))

## [1.10.4](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.10.3...web-v1.10.4) (2024-06-14)


### 🐞 Bug Fixes

* adds colon for meets all label ([#806](https://github.com/chanzuckerberg/cryoet-data-portal/issues/806)) ([abdbf55](https://github.com/chanzuckerberg/cryoet-data-portal/commit/abdbf55c99ebd5359118cc4c2afc25c16d7c3f48))
* download modal api docs link ([#805](https://github.com/chanzuckerberg/cryoet-data-portal/issues/805)) ([de97381](https://github.com/chanzuckerberg/cryoet-data-portal/commit/de97381a9822fca7e1507f01295c4a381663fa19))
* restore object count ([#804](https://github.com/chanzuckerberg/cryoet-data-portal/issues/804)) ([52a0058](https://github.com/chanzuckerberg/cryoet-data-portal/commit/52a00589a48d847792280c3190fbab00f0472a3e))


### 🧹 Miscellaneous Chores

* cleanup feature flags ([#808](https://github.com/chanzuckerberg/cryoet-data-portal/issues/808)) ([bab6036](https://github.com/chanzuckerberg/cryoet-data-portal/commit/bab60363422e32f65df964c50eab3dff341c4709))

## [1.10.3](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.10.2...web-v1.10.3) (2024-06-12)


### 🐞 Bug Fixes

* open run on hover ([#799](https://github.com/chanzuckerberg/cryoet-data-portal/issues/799)) ([77a6815](https://github.com/chanzuckerberg/cryoet-data-portal/commit/77a6815bd754618dbbb6e91aa6448d6f37bad3cb))


### 🧹 Miscellaneous Chores

* download dialog code snippet ([#794](https://github.com/chanzuckerberg/cryoet-data-portal/issues/794)) ([b88ed71](https://github.com/chanzuckerberg/cryoet-data-portal/commit/b88ed71af37ddd94b715d60750fc8c8de41a48b0))

## [1.10.2](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.10.1...web-v1.10.2) (2024-06-11)


### 🧹 Miscellaneous Chores

* hook up method type to front-end ([#797](https://github.com/chanzuckerberg/cryoet-data-portal/issues/797)) ([d6dcda5](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d6dcda5fd7799d1927efef34c0a6f5ed0d323365))
* update vite ([#796](https://github.com/chanzuckerberg/cryoet-data-portal/issues/796)) ([7c3e24f](https://github.com/chanzuckerberg/cryoet-data-portal/commit/7c3e24f6d4ea9bc9f991656f10bc8ddacc8d5b1a))

## [1.10.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.10.0...web-v1.10.1) (2024-06-08)


### 🧹 Miscellaneous Chores

* remove all mentions of kaggle ([#791](https://github.com/chanzuckerberg/cryoet-data-portal/issues/791)) ([60221d3](https://github.com/chanzuckerberg/cryoet-data-portal/commit/60221d3049a49f799c0b61bd80dc466b6cf3e955))


### ⚙ Continuous Integration

* pagination e2e ([#776](https://github.com/chanzuckerberg/cryoet-data-portal/issues/776)) ([3d78ef4](https://github.com/chanzuckerberg/cryoet-data-portal/commit/3d78ef47f6bc5339c69ff2748932740f70ecd1df))

## [1.10.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.9.0...web-v1.10.0) (2024-05-31)


### ✨ Features

* add ML Challenge organizers section ([#753](https://github.com/chanzuckerberg/cryoet-data-portal/issues/753)) ([a66f54b](https://github.com/chanzuckerberg/cryoet-data-portal/commit/a66f54b950ed51027b4749eca3392d79938169ff))
* add ML Challenge Page competition data section and CTA ([#754](https://github.com/chanzuckerberg/cryoet-data-portal/issues/754)) ([e836c22](https://github.com/chanzuckerberg/cryoet-data-portal/commit/e836c226f345d725677338e4f12c6a075c75f98e))
* add ML Challenge Page FAQ ([#762](https://github.com/chanzuckerberg/cryoet-data-portal/issues/762)) ([30974bf](https://github.com/chanzuckerberg/cryoet-data-portal/commit/30974bf8092585b383a1ab1b63d7757b58cd087f))
* add ML Challenge page main content ([#739](https://github.com/chanzuckerberg/cryoet-data-portal/issues/739)) ([d5ee77d](https://github.com/chanzuckerberg/cryoet-data-portal/commit/d5ee77d708795ee8deed99fff6067bb1915fff39))
* ML Challenge Banners ([#755](https://github.com/chanzuckerberg/cryoet-data-portal/issues/755)) ([47e9b45](https://github.com/chanzuckerberg/cryoet-data-portal/commit/47e9b457874cf531b93fbe69bb933537760efd66))
* ML Challenge Navigation ([#758](https://github.com/chanzuckerberg/cryoet-data-portal/issues/758)) ([131bf6b](https://github.com/chanzuckerberg/cryoet-data-portal/commit/131bf6b278a01d4b0afa49f7e3334c6972bbc234))

## [1.9.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.8.0...web-v1.9.0) (2024-05-30)


### ✨ Features

* ux navigation styling updates ([#737](https://github.com/chanzuckerberg/cryoet-data-portal/issues/737)) ([508ab9b](https://github.com/chanzuckerberg/cryoet-data-portal/commit/508ab9b2b1e186c65ab3d0bbf61179eda85139cb))


### 🧹 Miscellaneous Chores

* update babel traverse ([#767](https://github.com/chanzuckerberg/cryoet-data-portal/issues/767)) ([f53a779](https://github.com/chanzuckerberg/cryoet-data-portal/commit/f53a7791b108f7ab696e687e19e2b6a47fa74c7a))

## [1.8.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.7.0...web-v1.8.0) (2024-05-28)


### ✨ Features

* author orc id link ([#719](https://github.com/chanzuckerberg/cryoet-data-portal/issues/719)) ([9488f2a](https://github.com/chanzuckerberg/cryoet-data-portal/commit/9488f2a126a7bffe63151fa527a77d6df39d8793))
* ML challenge page routing ([#728](https://github.com/chanzuckerberg/cryoet-data-portal/issues/728)) ([be5e86c](https://github.com/chanzuckerberg/cryoet-data-portal/commit/be5e86c590a139282366ce2b1a06ac0b28fad323))
* run filter section titles ([#730](https://github.com/chanzuckerberg/cryoet-data-portal/issues/730)) ([5c29681](https://github.com/chanzuckerberg/cryoet-data-portal/commit/5c296814b1fa53bf45b2f30177410119e4e7c092))


### 🐞 Bug Fixes

* run header full width for firefox ([#731](https://github.com/chanzuckerberg/cryoet-data-portal/issues/731)) ([28a0738](https://github.com/chanzuckerberg/cryoet-data-portal/commit/28a0738f232be9265db7edb5a1976139cbe53473))


### 🧹 Miscellaneous Chores

* primary_annotator_status -&gt; primary_author_status ([#727](https://github.com/chanzuckerberg/cryoet-data-portal/issues/727)) ([a7d5af9](https://github.com/chanzuckerberg/cryoet-data-portal/commit/a7d5af9d6a264daedd43b728fdf68accc3ad9557))


### ⚙ Continuous Integration

* e2e filter utils ([#751](https://github.com/chanzuckerberg/cryoet-data-portal/issues/751)) ([21a8bf7](https://github.com/chanzuckerberg/cryoet-data-portal/commit/21a8bf7d3bbff014cbf1c7bcb178b0d964f0ad28))

## [1.7.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.6.3...web-v1.7.0) (2024-05-10)


### ✨ Features

* add breadcrumbs and change filter carryback behaviour ([#678](https://github.com/chanzuckerberg/cryoet-data-portal/issues/678)) ([b3d8ab6](https://github.com/chanzuckerberg/cryoet-data-portal/commit/b3d8ab6bc3f31521d7ce2b3cab4bf14fd3d876cb))
* implement single run page filters ([#605](https://github.com/chanzuckerberg/cryoet-data-portal/issues/605)) ([ae15d0d](https://github.com/chanzuckerberg/cryoet-data-portal/commit/ae15d0d63ff7135b4fb51d353971ab034f280eed))

## [1.6.3](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.6.2...web-v1.6.3) (2024-05-08)


### 🧹 Miscellaneous Chores

* change file summary location ([#701](https://github.com/chanzuckerberg/cryoet-data-portal/issues/701)) ([2ab75e8](https://github.com/chanzuckerberg/cryoet-data-portal/commit/2ab75e8942acf644236011fa27babe941123c437))


### ⚙ Continuous Integration

* single dataset page filter e2e ([#690](https://github.com/chanzuckerberg/cryoet-data-portal/issues/690)) ([948c8f2](https://github.com/chanzuckerberg/cryoet-data-portal/commit/948c8f270c214781614626bd601cd3e382fe01d9))

## [1.6.2](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.6.1...web-v1.6.2) (2024-05-01)


### 🧹 Miscellaneous Chores

* update report issues link ([#680](https://github.com/chanzuckerberg/cryoet-data-portal/issues/680)) ([7bfcffd](https://github.com/chanzuckerberg/cryoet-data-portal/commit/7bfcffd39f3edadf20a82071426c70f71d9ba740))

## [1.6.1](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.6.0...web-v1.6.1) (2024-05-01)


### 🐞 Bug Fixes

* file format race condition ([#687](https://github.com/chanzuckerberg/cryoet-data-portal/issues/687)) ([45dc2d5](https://github.com/chanzuckerberg/cryoet-data-portal/commit/45dc2d5ee051adc65818152c2ce9412970fff96f))
* prod e2e tests ([#682](https://github.com/chanzuckerberg/cryoet-data-portal/issues/682)) ([231ca02](https://github.com/chanzuckerberg/cryoet-data-portal/commit/231ca0273034ccccbc89aa2b8c793fd89ab29ebf))
* remove fileFormat param when toggling Download All Annotations ([#688](https://github.com/chanzuckerberg/cryoet-data-portal/issues/688)) ([b177e53](https://github.com/chanzuckerberg/cryoet-data-portal/commit/b177e53c23ca44d0624829d1f685c43b30331148))
* show all annotation shape types ([#679](https://github.com/chanzuckerberg/cryoet-data-portal/issues/679)) ([70f5f85](https://github.com/chanzuckerberg/cryoet-data-portal/commit/70f5f85147c3f0e766c998f9f08fd306caf06562))

## [1.6.0](https://github.com/chanzuckerberg/cryoet-data-portal/compare/web-v1.5.0...web-v1.6.0) (2024-04-27)


### ✨ Features

* add section titles ([#612](https://github.com/chanzuckerberg/cryoet-data-portal/issues/612)) ([42cc41e](https://github.com/chanzuckerberg/cryoet-data-portal/commit/42cc41ec98bdf90b0af2d18c4c76eecbddf420c5))
* navigation styling updates ([#614](https://github.com/chanzuckerberg/cryoet-data-portal/issues/614)) ([fb63462](https://github.com/chanzuckerberg/cryoet-data-portal/commit/fb63462915684046a1011d124d74e3423912e95a))
* shift dataset photo ([#613](https://github.com/chanzuckerberg/cryoet-data-portal/issues/613)) ([43064ba](https://github.com/chanzuckerberg/cryoet-data-portal/commit/43064ba5ec1461a25b0b7a86e86f0d7e18e5342a))


### 💅 Styles

* update author name styling in tables ([#580](https://github.com/chanzuckerberg/cryoet-data-portal/issues/580)) ([3d4a434](https://github.com/chanzuckerberg/cryoet-data-portal/commit/3d4a4340912e84bb6ac15e07d297c8057ee2b3bd))

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
