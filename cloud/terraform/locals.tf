locals {
  common_tags = {
    company     = var.company_name
    project     = "${var.company_name}-${var.project}"
    environment = var.environment
    deploy_id   = local.deploy_id
  }

  s3_bucket_name = lower(local.naming_prefix)

  naming_prefix = "${var.naming_prefix}-${var.environment}-${local.deploy_id}"
  deploy_id     = random_id.deploy_id.hex
}

# Randomly generated deployment ID
resource "random_id" "deploy_id" {
  byte_length = 4
}