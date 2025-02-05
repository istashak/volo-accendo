# inspired by: https://prashant-48386.medium.com/terraform-aws-certificate-manager-dns-validation-54a62b6ed26f
#
# Creates a certificate for the domain name specified by var.domain_name
resource "aws_acm_certificate" "cert" {
  domain_name               = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}", "*.${var.environment}.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-volo-accendo-certificate"
  })
}

# References the existing zone specified by var.domain_name 
data "aws_route53_zone" "volo_accendo_domain" {
  name         = var.zone_id
  private_zone = false
}

# Validates the certificate created above
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  }

  allow_overwrite = "true"
  name            = each.value.name
  records         = [each.value.value]
  type            = each.value.type
  ttl             = 60
  zone_id         = data.aws_route53_zone.volo_accendo_domain.zone_id
}

resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
  timeouts {
    create = "5m"
  }
}
