# Python API


## Data Model

The Python API client is primarily a GraphQL client that interacts with our GraphQL API endpoint. The data model for the python API client and the GraphQL API are identical.

If you prefer to query our API endpoint directly, it's available at https://graphql.cryoetdataportal.cziscience.com/v1/graphql.

A simplified diagram of the graph data model is below:

```{image} _static/img/data_model.png
:width: 1000
:alt: Simplified data model
:align: center
```

## API documentation

```{eval-rst}
.. autoclass:: cryoet_data_portal.Client
   :members:
   :inherited-members:

.. autoclass:: cryoet_data_portal.Dataset
   :members:
   :inherited-members:

.. autoclass:: cryoet_data_portal.DatasetAuthor
   :members:
   :inherited-members:

.. autoclass:: cryoet_data_portal.DatasetFunding
   :members:
   :inherited-members:

.. autoclass:: cryoet_data_portal.Run
   :members:
   :inherited-members:

.. autoclass:: cryoet_data_portal.TomogramVoxelSpacing
   :members:
   :inherited-members:

.. autoclass:: cryoet_data_portal.Tomogram
   :members:
   :inherited-members:

.. autoclass:: cryoet_data_portal.TomogramAuthor
   :members:
   :inherited-members:

.. autoclass:: cryoet_data_portal.Annotation
   :members:
   :inherited-members:

.. autoclass:: cryoet_data_portal.AnnotationFile
   :members:
   :inherited-members:

.. autoclass:: cryoet_data_portal.AnnotationAuthor
   :members:
   :inherited-members:

.. autoclass:: cryoet_data_portal.TiltSeries
   :members:
   :inherited-members:
