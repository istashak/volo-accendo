resource "aws_ses_email_identity" "contact_verification_email" {
  email = "no-reply@${local.domain_name}"
}

resource "aws_ses_domain_identity" "contact_verification_domain" {
  domain = local.domain_name
}

resource "aws_route53_record" "ses_contact_verification" {
  zone_id = data.tfe_outputs.networking.nonsensitive_values.domain_zone_id
  name    = aws_ses_domain_identity.contact_verification_domain.domain
  type    = "TXT"
  ttl     = 300
  records = [aws_ses_domain_identity.contact_verification_domain.verification_token]
}

resource "aws_ses_domain_dkim" "contact_verification_dkim" {
  domain = aws_ses_domain_identity.contact_verification_domain.domain
}

resource "aws_route53_record" "dkim" {
  count   = length(aws_ses_domain_dkim.contact_verification_dkim.dkim_tokens)
  zone_id = "Z123456789EXAMPLE"
  name    = "${aws_ses_domain_dkim.contact_verification_dkim.dkim_tokens[count.index]}._domainkey.${local.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = ["${aws_ses_domain_dkim.contact_verification_dkim.dkim_tokens[count.index]}.amazonses.com"]
}
