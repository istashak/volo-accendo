terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4.2"
    }
  }

  backend "s3" {
    bucket         = "voloaccendo-terraform-state"              # The name of the S3 bucket
    key            = "terraform.tfstate"                        # The path to store the state file in the bucket
    region         = "us-east-1"                                # The AWS region where your S3 bucket is located
    dynamodb_table = "voloaccendo-terraform-state-lock"         # The name of the DynamoDB table for state locking
  }
}