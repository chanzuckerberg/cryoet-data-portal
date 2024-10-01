#!/bin/bash

# Script to seed moto server; runs outside the motoserver container for development

aws="aws --endpoint-url=http://localhost:5566"
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_REGION=us-west-2

# Wipe out the bucket so we can start fresh.
$aws s3api delete-bucket --bucket $bucket_1 2>/dev/null || true

# Create dev bucket but don't error if it already exists (and it shouldn't exist)
bucket_1=test-public-bucket
$aws s3api head-bucket --bucket $bucket_1 2>/dev/null || $aws s3 mb s3://$bucket_1

$aws s3 sync test_files s3://$bucket_1/
