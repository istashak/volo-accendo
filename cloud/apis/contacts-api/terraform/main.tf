##################################################################################
# PROVIDERS
##################################################################################

provider "aws" {
  region = var.region
}

##################################################################################
# LAMBDA
##################################################################################

# Archive source

# data "archive_file" "lambda_source_package" {
#   type        = "zip"
#   source_dir  = "/dist"
#   output_path = "/.tmp/lambda.zip"
# }

# S3 bucket for lambda

# resource "aws_s3_bucket" "lambda_bucket" {
#   bucket        = local.s3_lambda_function_bucket_name
#   force_destroy = true

#   tags = merge(local.common_tags, {
#     resource_name = "${local.naming_prefix}-s3-lambda-function-bucket"
#   })
# }

# This ownership control seems to be necessary for the private aws_s3_bucket_acl to work.
resource "aws_s3_bucket_ownership_controls" "lambda_bucket" {
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
  acl        = "private"
}

resource "aws_s3_object" "lambda_source" {
  # bucket = aws_s3_bucket.lambda_bucket.id
  bucket = local.s3_lambda_function_bucket_name
  key    = "lambda.zip"
  # key    = "putContact/v${var.contacts_api_version}/lambda.zip"
  # source = data.archive_file.lambda_source_package.output_path
  # etag   = filemd5(data.archive_file.lambda_source_package.output_path)
}

# Lambda Function
resource "aws_lambda_function" "put_contact" {
  function_name = "${local.naming_prefix}-putContact"
  role          = aws_iam_role.lambda_role.arn
  handler       = "dist/src/put-contact.handler"
  runtime       = "nodejs20.x"
  timeout       = 60

  # The bucket name as created earlier with "aws s3api create-bucket"
  # s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_bucket = local.s3_lambda_function_bucket_name
  s3_key    = aws_s3_object.lambda_source.key
  # source_code_hash = filebase64sha256(data.archive_file.lambda_source_package.output_path)

  environment {
    variables = {
      REGION              = var.region
      NODE_ENV            = var.environment
      CONTACTS_TABLE_NAME = aws_dynamodb_table.contacts_table.name
    }
  }

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-contacts-lambda"
  })
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${local.naming_prefix}-lambda_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "LambdaExecutionRole"
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-lambda-role"
  })
}

resource "aws_iam_role_policy" "lambda_role_policy" {
  name = "${local.naming_prefix}-lambda-dynamodb-access-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ],
        Resource = "${aws_dynamodb_table.contacts_table.arn}"
      },
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents"
        ],
        Resource = "*"
      }
    ],
  })
}

# API Gateway v2 code inspired by: 
# https://antonputra.com/amazon/aws-api-gateway-custom-domain/#create-custom-domain-using-terraform-route53

resource "aws_apigatewayv2_api" "contacts" {
  name          = "contacts-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {

    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]

    expose_headers = ["*"]
    max_age        = 300
  }
}

resource "aws_cloudwatch_log_group" "contacts" {
  name = "/aws/api_gateway/${aws_apigatewayv2_api.contacts.name}"

  retention_in_days = 30
}

resource "aws_apigatewayv2_stage" "contacts" {
  name        = "contacts-staging-${var.environment}"
  api_id      = aws_apigatewayv2_api.contacts.id
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.contacts.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "put_contact" {
  api_id = aws_apigatewayv2_api.contacts.id

  integration_uri    = aws_lambda_function.put_contact.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "put_contact" {
  api_id = aws_apigatewayv2_api.contacts.id

  route_key = "POST /contacts"
  target    = "integrations/${aws_apigatewayv2_integration.put_contact.id}"
}

resource "aws_lambda_permission" "put_contact" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.put_contact.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.contacts.execution_arn}/*/*"
}

resource "aws_apigatewayv2_domain_name" "api" {
  domain_name = "api.${var.environment}.${data.tfe_outputs.networking.nonsensitive_values.domain_name}"

  domain_name_configuration {
    certificate_arn = data.tfe_outputs.networking.nonsensitive_values.aws_acm_certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }

  # TODO: Decide if this is necessary
  # depends_on = [aws_acm_certificate_validation.cert_validation]
}

resource "aws_route53_record" "api" {
  name    = aws_apigatewayv2_domain_name.api.domain_name
  type    = "A"
  zone_id = data.tfe_outputs.networking.nonsensitive_values.domain_zone_id

  alias {
    name                   = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_apigatewayv2_api_mapping" "api" {
  api_id      = aws_apigatewayv2_api.contacts.id
  domain_name = aws_apigatewayv2_domain_name.api.id
  stage       = aws_apigatewayv2_stage.contacts.id
}

resource "aws_apigatewayv2_api_mapping" "api_v1" {
  api_id          = aws_apigatewayv2_api.contacts.id
  domain_name     = aws_apigatewayv2_domain_name.api.id
  stage           = aws_apigatewayv2_stage.contacts.id
  api_mapping_key = "v1"
}
