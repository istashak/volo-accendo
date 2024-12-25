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

  ordered_cache_behavior {
    path_pattern     = "out/${var.environment}/next/server/app/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = aws_s3_bucket.web_app_bucket.id

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Priority 1
  # Behavior bypassing edge lambda
  # Path pattern can be changed to '*' here if no dynamic routes are used
  # This will result in a slight performance increase and decreased costs
  ordered_cache_behavior {
    path_pattern     = "index.html"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = aws_s3_bucket.web_app_bucket.id

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 60
    max_ttl                = 1200
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  default_cache_behavior {
    # Dynamic SSR pages
    target_origin_id = aws_s3_bucket.web_app_bucket.id

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }

    lambda_function_association {
      event_type = "origin-request"
      lambda_arn = aws_lambda_function.nextjs_ssr.qualified_arn
      # include_body = true
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 60
    max_ttl                = 900
    compress               = true
  }

  custom_error_response {
    error_code         = 404
    response_page_path = "/404.html"
    response_code      = 404
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

  alias {
    name                   = aws_cloudfront_distribution.web_app_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.web_app_distribution.hosted_zone_id
    evaluate_target_health = false
  }

  depends_on = [aws_acm_certificate_validation.cert_validation]
}
