---
hide-navigation: true
---

(data-model)=
# Data Model

To facilitate programmatic use of the CryoET Data Portal, we have a Python API client and a GraphQL API, which share a data model. Note that names are in snake case in the Python API client (other than class names, which are in upper camel case), and in lower camel case in the GraphQL API.

If you prefer to query our API endpoint directly, it's available at [https://graphql.cryoetdataportal.czscience.com/graphql](https://graphql.cryoetdataportal.czscience.com/graphql).

A simplified diagram of the data model is below:

```{image} _static/img/data_model.png
:width: 1000
:alt: Simplified data model
:align: center
```
