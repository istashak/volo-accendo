output "s3_web_app_bucket_name" {
  value = aws_s3_bucket.web_app_bucket.bucket
}

output "cloudfront_distribution_domain_name" {
  value = aws_cloudfront_distribution.web_app_distribution.domain_name
}

output "aws_acm_certificate_arn" {
  value = aws_acm_certificate.cert.arn
  description = "The arn of the aws certificate used for the domain name."
}

output "domain_zone_id" {
  value = data.aws_route53_zone.volo_accendo_domain.zone_id
  description = "The zone id of the volo accendo domain."
}
