# export TF_VAR_aws_access_key_id=AKIAVNTK4QBC355GAR4R
# export TF_VAR_aws_secret_access_key=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

variable "aws_access_key_id" {
  type        = string
  description = "A valid AWS access key id."
  sensitive   = true
}

variable "aws_secret_access_key" {
  type        = string
  description = "The AWS secret access key associated with the access key id."
  sensitive   = true
}

variable "environment" {
  type        = string
  description = "The environment of the deployment"
  default     = "dev"
}

module "dev_voloaccendo_app" {
    source     = "./.."
    environment           = var.environment
    aws_access_key_id     = var.aws_access_key_id
    aws_secret_access_key = var.aws_secret_access_key
    company_name          = "VoloAccendo"
    naming_prefix         = "volo-accendo-aws-resource"
    project               = "web-app"
    region                = "us-east-1"
    dynamodb_table_name   = "ContactsTable"
    contacts_api_version  = "1.0.0-SNAPSHOT"
    domain_name           = "voloaccendo.com"
}

output "s3_web_app_bucket_name" {
  value = module.dev_voloaccendo_app.s3_web_app_bucket_name
}

output "cloudfront_distribution_domain_name" {
  value = module.dev_voloaccendo_app.cloudfront_distribution_domain_name
}

output "hello_base_url" {
  value = module.dev_voloaccendo_app.hello_base_url
}

output "custom_domain_api" {
  value = module.dev_voloaccendo_app.custom_domain_api
}

output "custom_domain_api_v1" {
  value = module.dev_voloaccendo_app.custom_domain_api_v1
}