---
hide-navigation: true
---

# Python API

## Data Model

To facilitate programmatic use of the CryoET Data Portal, we have a Python API client and a GraphQL API, which share a data model. If you prefer to query our API endpoint directly, it is available at [https://graphql.cryoetdataportal.cziscience.com/v1/graphql](https://graphql.cryoetdataportal.cziscience.com/v1/graphql). Note that names are in snake case in the Python API client (other than class names, which are in upper camel case), and in lower camel case in the GraphQL API.

A simplified diagram of the data model is below:

```{image} _static/img/data_model.png
:width: 1000
:alt: Simplified data model
:align: center
```

(api-documentation)=
## API documentation

```{eval-rst}
.. automodule:: cryoet_data_portal
   :members:
   :inherited-members:
```
