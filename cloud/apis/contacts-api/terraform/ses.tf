resource "aws_ses_email_identity" "contact_verification_email" {
  email = "no-reply@${local.domain_name}"
}

resource "aws_ses_domain_identity" "contact_verification_domain" {
  domain = local.domain_name
}

resource "aws_route53_record" "ses_contact_verification" {
  zone_id = data.tfe_outputs.networking.nonsensitive_values.domain_zone_id
  name    = "_amazonses.${aws_ses_domain_identity.contact_verification_domain.domain}"
  type    = "TXT"
  ttl     = 300
  records = [aws_ses_domain_identity.contact_verification_domain.verification_token]
}

resource "aws_ses_domain_dkim" "contact_verification_dkim" {
  domain = aws_ses_domain_identity.contact_verification_domain.domain
}

# When starting from scratch this resource must be commented out for the first apply, as it
# depends on the creation of aws_ses_domain_dkim.contact_verification_dkim first.
#
# TODO: Look into how to set -target=aws_ses_domain_dkim.contact_verification_dkim when
# running applies for the Terraform Cloud webpage.
# resource "aws_route53_record" "dkim" {
#   for_each = toset(try(aws_ses_domain_dkim.contact_verification_dkim.dkim_tokens, []))
#   zone_id  = data.tfe_outputs.networking.nonsensitive_values.domain_zone_id
#   name     = "${each.value}.${local.domain_name}._domainkey"
#   type     = "CNAME"
#   ttl      = 300
#   records  = ["${each.value}.dkim.amazonses.com"]
# }
