# Randomly generated deployment ID
resource "random_id" "deploy_id" {
  byte_length = 4
}

locals {
  common_tags = {
    company     = var.company_name
    environment = var.environment
    deploy_id   = local.deploy_id
  }

  domain_name                    = data.tfe_outputs.networking.nonsensitive_values.domain_name
  s3_lambda_function_bucket_name = "${lower(local.naming_prefix)}-lambda-function-bucket"

  naming_prefix = "${var.naming_prefix}-${var.environment}"
  deploy_id     = random_id.deploy_id.hex
}
