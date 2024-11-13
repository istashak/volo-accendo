data "tfe_outputs" "networking" {
  organization = var.tfe_organization
  workspace    = var.tfe_networking_workspace
}

data "tfe_outputs" "deployment" {
  organization = var.tfe_organization
  workspace    = var.tfe_deployment_workspace
}