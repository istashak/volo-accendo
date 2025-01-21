resource "aws_cloudfront_origin_access_identity" "web_app_oai" {
  comment = "Volo Accendo's aws_cloudfront_origin_access_identity"
}

resource "aws_s3_bucket" "webapp_cloudfront_logs" {
  bucket = "webapp-cloudfront-logs-${var.environment}"
}

resource "aws_s3_bucket_ownership_controls" "webapp_cloudfront_logs" {
  bucket = aws_s3_bucket.webapp_cloudfront_logs.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "webapp_cloudfront_logs" {
  depends_on = [aws_s3_bucket_ownership_controls.webapp_cloudfront_logs]

  bucket = aws_s3_bucket.webapp_cloudfront_logs.id
  acl    = "log-delivery-write"
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

  # Conditionally set aliases based on the environment
  aliases = var.environment == "prod" ? ["voloaccendo.com", "www.voloaccendo.com"] : ["dev.voloaccendo.com", "www.dev.voloaccendo.com"]

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Distribution for Volo Accendo's web app"
  default_root_object = "index.html"

  # Priority 0
  ordered_cache_behavior {
    path_pattern     = "*"
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

    # Attach CloudFront Function for path rewrite
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.path_rewrite.arn
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  # # Priority 1
  # ordered_cache_behavior {
  #   path_pattern     = "/dynamic/*"
  #   allowed_methods  = ["GET", "HEAD", "OPTIONS"]
  #   cached_methods   = ["GET", "HEAD", "OPTIONS"]
  #   target_origin_id = aws_s3_bucket.web_app_bucket.id

  #   forwarded_values {
  #     query_string = true
  #     headers      = ["Origin"]

  #     cookies {
  #       forward = "all"
  #     }
  #   }

  #   lambda_function_association {
  #     event_type   = "origin-request"
  #     lambda_arn   = aws_lambda_function.nextjs_ssr.qualified_arn
  #     include_body = true
  #   }

  #   viewer_protocol_policy = "redirect-to-https"
  #   compress               = true
  #   min_ttl                = 0
  #   default_ttl            = 0
  #   max_ttl                = 0
  # }

  default_cache_behavior {
    target_origin_id = aws_s3_bucket.web_app_bucket.id
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]

    forwarded_values {
      query_string = true
      headers      = ["Origin"]

      cookies {
        forward = "all"
      }
    }

    lambda_function_association {
      event_type   = "origin-request"
      lambda_arn   = aws_lambda_function.nextjs_ssr.qualified_arn
      include_body = true
    }

    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  custom_error_response {
    error_code         = 404
    response_page_path = "/404.html"
    response_code      = 404
  }

  logging_config {
    bucket = aws_s3_bucket.webapp_cloudfront_logs.bucket_domain_name
    prefix = "cloudfront-logs/"
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

resource "aws_cloudfront_function" "path_rewrite" {
  name    = "path-rewrite-function"
  runtime = "cloudfront-js-1.0"

  code = file("${path.module}/path-rewrite-function.js")
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
