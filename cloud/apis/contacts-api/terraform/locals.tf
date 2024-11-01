locals {
  common_tags = {
    company     = var.company_name
    environment = var.environment
    deploy_id   = local.deploy_id
  }

  s3_web_app_bucket_name         = "${lower(local.naming_prefix)}-web-app-bucket"
  s3_lambda_function_bucket_name = "${lower(local.naming_prefix)}-lambda-fuction-bucket"

  naming_prefix = "${var.naming_prefix}-${var.environment}-${local.deploy_id}"
  deploy_id     = random_id.deploy_id.hex
}

# Randomly generated deployment ID
resource "random_id" "deploy_id" {
  byte_length = 4
}