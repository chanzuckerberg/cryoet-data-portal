Python API
==============================

Data Model
----
The Python API client is primarily a GraphQL client that interacts with our GraphQL API endpoint. The data model for the python API client and the GraphQL API are identical.

If you prefer to query our API endpoint directly, it's available at [https://graphql.cryoetdataportal.cziscience.com/v1/graphql](https://graphql.cryoetdataportal.cziscience.com/v1/graphql)

A simplified diagram of our the graph data model is below:

<img src="{{ pathto('_static/img/data_model.png', 1) }}" />

Create an api client object
----
.. autofunction:: cryoet_data_portal.Client

Functionality common to all Domain Objects
----
.. autofunction:: cryoet_data_portal.Model.find_by_id
.. autofunction:: cryoet_data_portal.Model.find

Data Portal Domain Objects
----
.. autofunction:: cryoet_data_portal.Dataset
.. autofunction:: cryoet_data_portal.DatasetAuthor
.. autofunction:: cryoet_data_portal.DatasetFunding
.. autofunction:: cryoet_data_portal.Run
.. autofunction:: cryoet_data_portal.Tomogram
.. autofunction:: cryoet_data_portal.Annotation
.. autofunction:: cryoet_data_portal.AnnotationAuthor
.. autofunction:: cryoet_data_portal.TiltSeries
