##################################################################################
# PROVIDERS
##################################################################################

provider "aws" {
  region = var.region
}
resource "random_id" "deploy_id" {
  byte_length = 4
}

locals {
  s3_lambda_function_bucket_name = "${lower(local.naming_prefix)}-lambda-fuction-bucket"
  naming_prefix                  = "${var.naming_prefix}-${var.environment}-${local.deploy_id}"
  deploy_id                      = random_id.deploy_id.hex
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket        = local.s3_lambda_function_bucket_name
  force_destroy = true

  tags = {
    company       = var.company_name
    environment   = var.environment
    deploy_id     = local.deploy_id
    resource_name = local.s3_lambda_function_bucket_name
  }
}