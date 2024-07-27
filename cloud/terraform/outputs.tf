output "s3_web_app_bucket_name" {
  value = aws_s3_bucket.web_app_bucket.bucket
}

output "cloudfront_distribution_domain_name" {
  value = aws_cloudfront_distribution.web_app_distribution.domain_name
}