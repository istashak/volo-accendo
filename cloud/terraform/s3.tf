# S3 Bucket config
resource "aws_s3_bucket" "web_app_bucket" {
  bucket        = local.s3_web_app_bucket_name
  force_destroy = true

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-s3-web-app-bucket"
  })
}

resource "aws_s3_bucket_versioning" "web_bucket_versioning" {
  bucket = aws_s3_bucket.web_app_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

data "aws_caller_identity" "current" {}

# resource "aws_s3_bucket_public_access_block" "web_app_s3_access_block" {
#   bucket = aws_s3_bucket.web_app_bucket.id

#   block_public_acls       = false
#   block_public_policy     = false
# }

resource "aws_s3_bucket_policy" "web_app_bucket_policy" {
  bucket = aws_s3_bucket.web_app_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontAccess",
        Effect = "Allow",
        Principal = {
          "AWS" : "${aws_cloudfront_origin_access_identity.web_app_oai.iam_arn}"
        },
        Action   = "s3:GetObject",
        Resource = "${aws_s3_bucket.web_app_bucket.arn}/*"
      }
    ]
  })
}

