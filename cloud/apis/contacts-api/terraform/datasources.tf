data "tfe_outputs" "networking" {
  organization = var.tfe_organization
  workspace    = var.tfe_workspace
}