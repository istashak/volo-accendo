locals {
  common_tags = {
    company     = var.company_name
    environment = var.environment
  }

  s3_lambda_function_bucket_name = "${lower(local.naming_prefix)}-lambda-fuction-bucket"

  naming_prefix = "${var.naming_prefix}-${var.environment}"
}
