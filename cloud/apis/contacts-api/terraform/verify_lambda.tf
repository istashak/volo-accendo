# This ownership control seems to be necessary for the private aws_s3_bucket_acl to work.
resource "aws_s3_bucket_ownership_controls" "verify_lambda_bucket" {
  # bucket = aws_s3_bucket.lambda_bucket.id
  bucket = local.s3_lambda_function_bucket_name
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket" {
  depends_on = [aws_s3_bucket_ownership_controls.lambda_bucket]
  # bucket     = aws_s3_bucket.lambda_bucket.id
  bucket = local.s3_lambda_function_bucket_name
  acl    = "private"
}

resource "aws_s3_object" "verify_lambda_source" {
  # bucket = aws_s3_bucket.lambda_bucket.id
  bucket = local.s3_lambda_function_bucket_name
  key    = "lambda.zip"
  # key    = "putContact/v${var.contacts_api_version}/lambda.zip"
  # source = data.archive_file.lambda_source_package.output_path
  # etag   = filemd5(data.archive_file.lambda_source_package.output_path)
}

# Lambda Function
resource "aws_lambda_function" "verify_contact" {
  function_name = "${local.naming_prefix}-putContact"
  role          = aws_iam_role.lambda_role.arn
  handler       = "dist/src/put-contact.handler"
  runtime       = "nodejs20.x"
  timeout       = 60

  # The bucket name as created earlier with "aws s3api create-bucket"
  # s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_bucket         = local.s3_lambda_function_bucket_name
  s3_key            = aws_s3_object.lambda_source.key
  s3_object_version = aws_s3_object.lambda_source.version_id
  # source_code_hash = filebase64sha256(data.archive_file.lambda_source_package.output_path)

  environment {
    variables = {
      REGION                 = var.region
      NODE_ENV               = var.environment
      CONTACTS_TABLE_NAME    = aws_dynamodb_table.contacts_table.name
      DOMAIN                 = local.domain_name
      ENVIRONMENT_AND_DOMAIN = local.environment_and_domain_name
      SES_EMAIL_SOURCE       = aws_ses_email_identity.contact_verification_email.email
    }
  }

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-contacts-lambda"
  })
}