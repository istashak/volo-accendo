terraform {
  cloud {
    organization = "volo-accendo"
    workspaces {
      name = "volo-accendo-cloud-dev"
    }
  }
}