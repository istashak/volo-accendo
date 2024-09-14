# backend-dev.tf
terraform {
  backend "s3" {
    bucket         = "voloaccendo-terraform-state-dev"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "voloaccendo-terraform-state-lock-dev"
  }
}
