# Volo Accendo Inc.

A monorepo containing the web, mobile, and cloud infrastructure for Volo Accendo's digital presence.

## Repository Structure

- `web/` - Next.js website with Lambda@Edge SSR implementation for cost-effective hosting
- `mobile/` - Mobile application codebase
- `cloud/` - AWS infrastructure managed via HashiCorp Terraform
  - `terraform/` - Infrastructure as Code definitions
  - `apis/` - Backend API implementations

## Infrastructure

- AWS infrastructure managed through HashiCorp Terraform
- Multiple environments (dev and prod)
  - [https://dev.voloaccendo.com](https://dev.voloaccendo.com)
  - [https://voloaccendo.com](https://voloaccendo.com)
- Lambda@Edge function for server-side rendering to optimize costs for low-traffic website
- GitHub Actions workflows for CI/CD:
  - Next.js build and deployment
  - Contacts API build, test, and deployment

## Development

Each directory contains its own README with specific setup and development instructions.
