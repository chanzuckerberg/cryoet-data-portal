# Frequently Asked Questions

We hope these answers will help you get the most out of the CryoET Data Portal! If you need additional information or assistance, you can reach us by submitting a [Github Issue](https://github.com/chanzuckerberg/cryoet-data-portal/issues/new). For help with submitting an issue, follow [these instructions](#how-can-i-get-help-with-using-the-data-portal).

## How do I get help with using the Data Portal?

Did you encounter a bug, error, or other issue while using the portal? [Submit an issue on Github](https://github.com/chanzuckerberg/cryoet-data-portal/issues) to let us know!

To submit an issue, you'll need to create a [free Github account](https://github.com/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F&source=header-home). 
This allows our team to follow up with you on Github if we have a question about the problem you encountered. Then, [fill out this form](https://github.com/chanzuckerberg/cryoet-data-portal/issues/new). 
We suggest you use a descriptive title, paste an error messages using the `<>` icon on the form, and provide as many details as possible about the problem, including what you expected to happen and what type of machine you were using.

An example issue is below:

Title: Tomogram TS_026 cannot be downloaded

Body: 
I have the AWS CLI tool installed on a Mac computer. I copied the download command from the prompt on the tomogram page. Instead of downloading, I received this error message:
```
ERROR MESSAGE COPIED FROM TERMINAL
```
------------------------------------------
For more information about submiting issues on Github, please refer to [Github's documentation](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue#creating-an-issue-from-a-repository).

## What are datasets, runs, and annotations in the Data Portal?

The CryoET Data Portal uses the following data schema:

1. A dataset is a community contributed set of image files for tilt series, reconstructed tomograms, and if available, cellular and/or subcellular annotation files. Every dataset contains only one sample type prepared and imaged with the same conditions. The dataset title, such as `S. pombe cryo-FIB lamellae acquired with defocus-only`, summarizes these conditions. Samples can be a cell, tissue or organism; intact organelle; in-vitro mixture of macromolecules or their complex; or in-silico synthetic data, where the experimental conditions are kept constant. Downloading a dataset downloads all files, including all available tilt series, tomograms, and annotations.
2. A run is one experiment, or replicate, associated with a dataset, where all runs in a dataset have the same sample and imaging conditions. Every run contains a collection of all tomography data and annotations related to imaging one physical location in a sample. It typically contains one tilt series and all associated data (e.g. movie frames, tilt series image stack, tomograms, annotations, and metadata), but in some cases, it may be a set of tilt series that form a mosaic. When downloading a run, you may download only the tomograms or the tomograms and available annotations.
3. An annotation is a point or segmentation indicating the location of a macromolecular complex in the tomogram. On the run page, you may choose to download tomograms with their annotations.

Descriptions of all terminology and metadata used in the Portal is provided [here](https://docs.google.com/document/d/11h0u3YYF1EWCTjxu3ObShx26HgLAfJhn9I_tIaeQ6GI/edit#?usp=sharing). You can refer to a graphic of the [data schema here](https://chanzuckerberg.github.io/cryoet-data-portal/python-api.html#data-model).

## How do I download data using Amazon Web Services (AWS)?

Below are details on how to use the Amazon Web Services (AWS) Command Line Interface (CLI) tool to download data from the CryoET Data Portal. 

**The Data Portal's S3 bucket is public**, so it can be used without credential sign in by specifying `--no-sign-request` in your commands. In only a few minutes, you can get started downloading data following the steps in the [Quickstart Guide](#quickstart), and for more details, refer to the [Installation](#installation), [Download Data](#download-data), and [Optimize Download Speed](#optimize-download-speed) in-depth explanations.

### Quickstart
1. Download the installer: [MacOS Installer Download](https://awscli.amazonaws.com/AWSCLIV2.pkg) / [Windows Installer Download](https://awscli.amazonaws.com/AWSCLIV2.msi)
2. Open installer and complete installation following prompts. (No further steps, since credentials ARE NOT needed to use the tool.)
3. Open terminal (MacOS) or command prompt (Windows).
4. Copy and paste the command from the download prompt for the desired data into terminal / command prompt and hit enter.
5. Alternatively, create a custom command inserting the S3 URL of the data and the desired download destination in the spaces provided.
```
aws s3 cp --no-sign-request [S3 bucket URL] [Local destination path]
```

For example, to download a particular JSON file of tomogram metadata into a folder called "Downloads" use:

```
aws s3 cp --no-sign-request s3://cryoet-data-portal-public/10000/TS_026/Tomograms/VoxelSpacing13.48/CanonicalTomogram/tomogram_metadata.json ~/Downloads/
```
In the above example, the download happened very quickly because the file was only about 1 kB in size. However, typical tomograms are multiple GB, so expect downloading to take 30-60 mins for a single tomogram for a given run, but downloading could take as long as days depending on the number and sizes of the files. To speed up download, you can follow [these instructions to optimize download speed](#optimize-download-speed)

For more detailed instructions, please refer to the sections below.

1. [Installation](#installation)
2. [Download Data](#download-data)
3. [Optimize Download Speed](#optimize-download-speed)

### Installation

The CryoET Data Portal uses public AWS S3 buckets to host the data. The AWS Command Line Interface (CLI) tool will be used for downloading data from this S3 bucket `s3://cryoet-data-portal-public`. The simplest way to use this tool is to install it without setting up any credentials, and those instructions are below for MacOS and Windows. However, you may also complete a full installation and credential setup using the instructions provided by [AWS here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

Once AWS CLI is installed, you will be able to use it in terminal (MacOS) or command prompt (Windows) to download data. AWS CLI will not show up as an app on your desktop however since it is a command-line only tool.

#### MacOS Installation

1. Download the installer pkg file using this URL: [https://awscli.amazonaws.com/AWSCLIV2.pkg](https://awscli.amazonaws.com/AWSCLIV2.pkg)
2. Open the file and follow the instructions provided in the installer window.

To confirm successful installation, open terminal and type `aws --version` to list the version of the AWS CLI installed. If installation was successful, you should see an output like: 
```
aws-cli/2.7.25 Python/3.10.6 Darwin/23.0.0 source/arm64 prompt/off
```

#### Windows Installation

1. Download the installer pkg file using this URL: [https://awscli.amazonaws.com/AWSCLIV2.msi](https://awscli.amazonaws.com/AWSCLIV2.msi)
2. Open the file and follow the instructions provided in the installer window. 

To confirm successful installation, open a command prompt window (open the Start menu and search for cmd) and type `aws --version` to list the version of the AWS CLI installed. If installation was successful, you should see an output like: 
```
aws-cli/2.10.0 Python/3.11.2 Windows/10 exe/AMD64 prompt/off
```

### Download Data

To download data, we'll run commands in terminal (MacOS) or command prompt (Windows). The basic structure of these commands is below:
```
aws <command> <subcommand> <flags> [options and parameters (often S3 URL)]
```
If you followed the above installation instructions, which did not include setting up credentials, use `--no-sign-request` as a `<flag>` in all of your AWS CLI commands to indicate that you are accessing the bucket without signing in.

The URL of the CryoET Data Portal is `s3://cryoet-data-portal-public`, and each dataset in the bucket has its own unique URL such as `s3://cryoet-data-portal-public/10000/TS_026`.

To list all files in a directory, use the `s3` and `ls` as the `<command>` and `<subcommand>`, respectively. 

The basic structure of this command is `aws s3 ls --no-sign-request [s3 bucket URL]`. For example, to list all data in the portal use:

```
aws s3 ls --no-sign-request s3://cryoet-data-portal-public
```

The output should be a list of dataset IDs, for example:

```
PRE 10000/
PRE 10001/
PRE 10004/
```

To download a file, We can use the `s3` and `cp` as the `<command>` and `<subcommand>`, respectively. The basic structure of this command is `aws s3 cp --no-sign-request [s3 bucket URL] [Local destination path]`, where the `Local destination path` is whereever you'd like the file to be downloaded. For example, to download a particular JSON file of tomogram metadata into a folder called "Downloads" use:

```
aws s3 cp --no-sign-request s3://cryoet-data-portal-public/10000/TS_026/Tomograms/VoxelSpacing13.48/CanonicalTomogram/tomogram_metadata.json ~/Downloads/
```
The file should appear in your specified directory and the output in terminal / command prompt should be something like:
```
download: s3://cryoet-data-portal-public/10000/TS_026/Tomograms/VoxelSpacing13.48/CanonicalTomogram/tomogram_metadata.json to ./tomogram_metadata.json
```

In the above example, the download happened very quickly because the file was only about 1 kB in size. However, typical tomograms are multiple GB, so expect downloading to take 30-60 mins for a single tomogram for a given run, but downloading could take as long as days depending on the number and sizes of the files. 

### Optimize Download Speed

You can optimize your download speed by configuring your AWS CLI with the below command, which will increase your transfer rate to ~50 MB/s if your connection has sufficient bandwidth. 
```
aws configure set default.s3.max_concurrent_requests 30
```

To learn more about configuring your AWS CLI, refer to the [documentation here](https://docs.aws.amazon.com/cli/latest/topic/s3-config.html).

## How do I use Neuroglancer to visual tomograms with their annotations?

All tomograms in the Data Portal are viewable in Neuroglancer along with their annotations. You can open a tomogram in Neuroglancer by clicking the blue `View Tomogram` button on any run page in the Portal. This will open an instance of Neuroglancer in a separate tab of your browser with the selected data along with their annotations already loaded. For more information about visualizing data with Neuroglancer, check out the documentation from Connectomics, the team that develops Neuorglancer, [here](https://connectomics.readthedocs.io/en/latest/external/neuroglancer.html#basic-usage).

## How do I use napari to visual tomograms with their annotations?

The CryoET Data Portal napari plugin can be used to visualize tomograms, annotations, and metadata. Refer to [this documentation](https://github.com/chanzuckerberg/napari-cryoet-data-portal#usage) to learn about how to use the plugin and to [this page](https://chanzuckerberg.github.io/cryoet-data-portal/cryoet_data_portal_docsite_napari.html) to learn more about napari and CryoET Data Poral.

## How do I download data using the Portal's API?

The `Dataset` and `Run` classes both have `download_everything` methods which allow you to download all data associated with either an entire dataset or a single run within that dataset, respectively. 

`download_mrcfile` and `download_omezarr`

The Portal's API reference can be found [here](https://chanzuckerberg.github.io/cryoet-data-portal/python-api.html).

## How do I use the Portal's API to select data?


## What is the dataset identifier and portal ID?

The dataset identifier in the API refers to the Portal ID provided in the Portal. This number is assigned by the Data Portal as a unique identifier for a dataset and is used as the directory name in the data filetree.

Descriptions of all terminology and metadata used in the Portal is provided [here](https://docs.google.com/document/d/11h0u3YYF1EWCTjxu3ObShx26HgLAfJhn9I_tIaeQ6GI/edit#?usp=sharing).

## How do I contribute data to the Portal?

Thank you for considering submitting data to the Portal! 

Contributions can be raw data (tilt series and movie frames) + resulting tomograms, a new tomogram for existing raw data in the Portal generated using a different algorithm, and/or annotations of existing tomograms. We will work with you directly to upload the data to the Portal. Please fill out [this contribution survey](ADD LINK TO SURVEY), which is also found through the `Tell Us More` button on the bottom of Portal pages. We will then reach out to you to start the process of uploading your data. We have a ~6 month release cycle, so please allow time for the data to become available through the portal. 

In the future, we plan to implement a self-upload process so that users can add their data to the Portal on their own.

**Last Updated: November 28, 2023.**
