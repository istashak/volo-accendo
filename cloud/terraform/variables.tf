variable "company_name" {
  type        = string
  description = "The company name that owns the VPC."
}

variable "project" {
  type        = string
  description = "Project name for resource tagging"
}

variable "naming_prefix" {
  type        = string
  description = "Naming prefix for all resources."
}

variable "environment" {
  type        = string
  description = "The environment of the deployment"
  default     = "dev"
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



# variable "database_subnets" {
#   type    = list(string)
#   default = ["10.0.8.0/24", "10.0.9.0/24"]
# }