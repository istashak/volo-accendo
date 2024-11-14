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

variable "dynamodb_table_name" {
  type        = string
  description = "Name of the dynamo DB contact table."
  default     = "ContactsTable"
}

variable "contacts_api_version" {
  type        = string
  description = "The version of the Contacts API."
  default     = "v1.0"
}

variable "tfe_organization" {
  type        = string
  description = "(Required) The terraform cloud organization"
}

variable "tfe_networking_workspace" {
  type        = string
  description = "(Required) The terraform cloud workspace for the networking configuration"
}