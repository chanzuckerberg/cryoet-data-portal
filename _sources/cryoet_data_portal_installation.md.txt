# Installation

## Requirements

The CryoET Data Portal Client requires a Linux or MacOS system with:

- Python 3.7 to Python 3.10. Or R, supported versions TBD.
- Recommended: >16 GB of memory.
- Recommended: >5 Mbps internet connection.
- Recommended: for increased performance, use the API through an AWS-EC2 instance from the region `us-west-2`. The CryoET Portal data are hosted in a AWS-S3 bucket in that region.


## Python

(Optional) In your working directory, make and activate a virtual environment or conda environment. For example:

```shell
python -m venv ./venv
source ./venv/bin/activate
```

Install the latest `cryoet_data_portal` package via pip:

```shell
pip install -U cryoet_data_portal
```
