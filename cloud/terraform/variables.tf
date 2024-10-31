# variable "aws_access_key_id" {
#   type        = string
#   description = "A valid AWS access key id."
#   sensitive   = true
# }

# variable "aws_secret_access_key" {
#   type        = string
#   description = "The AWS secret access key associated with the access key id."
#   sensitive   = true
# }

variable "company_name" {
  type        = string
  description = "The company name that owns the VPC."
}

variable "naming_prefix" {
  type        = string
  description = "Naming prefix for all resources."
}

variable "environment" {
  type        = string
  description = "The environment of the deployment"
}

variable "region" {
  type        = string
  description = "AWS region to use for resources."
  default     = "us-east-1"
}

variable "vpc_cidr_block" {
  type        = string
  description = "Base CIDR Block for VPC"
  default     = "10.0.0.0/16"
}

variable "vpc_public_subnet_count" {
  type        = number
  description = "Number of public subnets to create."
  default     = 1
}

variable "dynamodb_table_name" {
  type        = string
  description = "Name of the dynamo DB contact table."
  default     = "ContactsTable"
}

variable "apis_relative_path" {
  type        = string
  description = "The relative path to the apis directory."
  default     = "../apis"
}

variable "contacts_api_version" {
  type        = string
  description = "The version of the Contacts API."
}

variable "domain_name" {
  type        = string
  description = "The domain name"
}
