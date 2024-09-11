---
hide-navigation: true
---

# Download Data

## Download data using AWS CLI

**The Data Portal's S3 bucket is public**, so it can be accessed without creating an account with AWS, simply add `--no-sign-request` in your commands as shown below. We recommend following our [Quickstart Guide](#quickstart) to get started downloading data in only a few minutes.

For more details or to troubleshoot, refer to these in-depth explanations:

1. [Installation](#installation)
2. [Download Data](#download-data)
3. [Optimize Download Speed](#optimize-download-speed)

### Quickstart

1. Download the installer: [MacOS Installer Download](https://awscli.amazonaws.com/AWSCLIV2.pkg) / [Windows Installer Download](https://awscli.amazonaws.com/AWSCLIV2.msi)
2. Open the installer and complete installation following the prompts. (No further steps, since sign-in credentials ARE NOT needed to use the tool.)
3. Open terminal (MacOS) or command prompt (Windows).
4. Copy and paste the command from the download prompt for the desired data into terminal / command prompt and hit enter.
5. Alternatively, create a custom command inserting the S3 URL of the data and the desired download destination in the spaces provided.

To download a single file, use `cp`:
```
aws s3 cp --no-sign-request [S3 bucket URL] [Local destination path]
```
To download multiple files, use `sync`
```
aws s3 sync --no-sign-request [S3 bucket URL] [Local destination path]
```

For example, to download a particular JSON file of tomogram metadata into a folder called "Downloads" use:

```
aws s3 cp --no-sign-request s3://cryoet-data-portal-public/10000/TS_026/Tomograms/VoxelSpacing13.48/CanonicalTomogram/tomogram_metadata.json ~/Downloads/
```

In the above example, the download happened very quickly because the file was only about 1 kB in size. However, typical tomograms are multiple GB, so expect downloading to take 30-60 mins for a single tomogram for a given run, but downloading could take as long as days depending on the number and sizes of the files. To speed up download, you can follow [these instructions to optimize download speed](#optimize-download-speed).

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

To download a file, We can use the `s3` and `cp`(for single files) or `sync`(for multiple files) as the `<command>` and `<subcommand>`, respectively. The basic structure of this command is `aws s3 cp --no-sign-request [s3 bucket URL] [Local destination path]` (for single file download) or `aws s3 sync --no-sign-request [s3 bucket URL] [Local destination path]` (for multiple file download) , where the `Local destination path` is wherever you'd like the file to be downloaded. For example, to download a particular single JSON file of tomogram metadata into a folder called "Downloads" use:

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
