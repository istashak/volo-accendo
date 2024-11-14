resource "aws_cloudfront_origin_access_identity" "web_app_oai" {
  comment = "Volo Accendo's aws_cloudfront_origin_access_identity"
}

resource "aws_cloudfront_distribution" "web_app_distribution" {
  origin {
    # domain_name = "${var.environment == "prod" ? "" : "dev."}${aws_s3_bucket.web_app_bucket.bucket_regional_domain_name}"
    domain_name = aws_s3_bucket.web_app_bucket.bucket_regional_domain_name
    origin_id   = aws_s3_bucket.web_app_bucket.id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.web_app_oai.cloudfront_access_identity_path
    }
  }

  # aliases = ["voloaccendo.com", "www.voloaccendo.com"]
  # Conditionally set aliases based on the environment
  aliases = var.environment == "prod" ? ["voloaccendo.com", "www.voloaccendo.com"] : ["dev.voloaccendo.com", "www.dev.voloaccendo.com"]

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Distribution for Volo Accendo's web app"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.web_app_bucket.id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.cert_validation.certificate_arn
    minimum_protocol_version = "TLSv1"
    ssl_support_method       = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-cloud-front-distribution"
  })
}

# Creates the zone record that enables the domain name root (i.e. voloaccendo.com) to be an alias for the
# CloudFront hosted website.
resource "aws_route53_record" "domain_name" {
  zone_id = data.aws_route53_zone.volo_accendo_domain.zone_id
  name    = var.environment == "prod" ? "" : "dev."
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.web_app_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.web_app_distribution.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_acm_certificate_validation.cert_validation]
}

# Creates the zone record that enables the subdomain "www" of a domain (i.e. www.voloaccendo.com) to be an alias for the
# CloudFront hosted website.
resource "aws_route53_record" "www_domain_name" {
  zone_id = data.aws_route53_zone.volo_accendo_domain.zone_id
  name    = "www${var.environment == "prod" ? "" : ".dev"}"
  type    = "A"
  # ttl     = "172800"
  alias {
    name                   = aws_cloudfront_distribution.web_app_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.web_app_distribution.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_acm_certificate_validation.cert_validation]
}