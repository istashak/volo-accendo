data "tfe_outputs" "networking" {
  organization = var.tfe_organization
  workspace    = "volo-accendo-cloud-prod"
}
