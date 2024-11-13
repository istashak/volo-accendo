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