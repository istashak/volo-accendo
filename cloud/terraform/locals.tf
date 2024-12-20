locals {
  common_tags = {
    company     = var.company_name
    environment = var.environment
    deploy_id   = local.deploy_id
  }

  s3_web_app_bucket_name = "${lower(local.naming_prefix)}-web-app-bucket"
  lambda_edge_zip_key = "nextjs-lambda-edge.zip"

  naming_prefix = "${var.naming_prefix}-${var.environment}"
  deploy_id     = random_id.deploy_id.hex
}

# Randomly generated deployment ID
resource "random_id" "deploy_id" {
  byte_length = 4
}