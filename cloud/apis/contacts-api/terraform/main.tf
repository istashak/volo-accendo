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

# resource "aws_s3_bucket_versioning" "lambda_bucket_versioning" {
#   bucket = aws_s3_bucket.lambda_bucket.id
#   versioning_configuration {
#     status = "Enabled"
#   }
# }

variable "lambda_functions" {
  default = {
    putContact = {
      handler      = "src/lambdas/put-contact/put-contact.handler"
      zip_key      = "put-contact-lambda.zip"
      route_method = "POST"
      route_path   = "/contacts"
    }
    verifyContact = {
      handler      = "src/lambdas/verify-contact/verify-contact.handler"
      zip_key      = "verify-contact-lambda.zip"
      route_method = "GET"
      route_path   = "/contacts/verify"
    }
  }
}

# This ownership control seems to be necessary for the private aws_s3_bucket_acl to work.
resource "aws_s3_bucket_ownership_controls" "contacts_api_lambda_bucket" {
  bucket = local.s3_lambda_function_bucket_name
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "contacts_api_lambda_bucket" {
  depends_on = [aws_s3_bucket_ownership_controls.contacts_api_lambda_bucket]
  bucket     = local.s3_lambda_function_bucket_name
  acl        = "private"
}

resource "aws_s3_object" "contacts_api_lambda_source" {
  for_each = var.lambda_functions

  bucket = local.s3_lambda_function_bucket_name
  key    = each.value.zip_key
  # etag = filemd5(each.value.zip_key)
}

# Lambda Function
resource "aws_lambda_function" "contacts_api_lambda_functions" {
  for_each = var.lambda_functions

  function_name = "${local.naming_prefix}-${each.key}"
  role          = aws_iam_role.lambda_role.arn
  handler       = each.value.handler
  runtime       = "nodejs20.x"
  timeout       = 60

  # S3 bucket and object info
  s3_bucket         = local.s3_lambda_function_bucket_name
  s3_key            = aws_s3_object.contacts_api_lambda_source[each.key].key
  s3_object_version = aws_s3_object.contacts_api_lambda_source[each.key].version_id

  environment {
    variables = {
      REGION                 = var.region
      NODE_ENV               = var.environment
      CONTACTS_TABLE_NAME    = aws_dynamodb_table.contacts_table.name
      DOMAIN                 = local.domain_name
      SES_EMAIL_SOURCE       = "no-reply@${local.domain_name}"
      ALERT_EMAIL_ADDRESS    = var.alert_email_address
    }
  }

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-${each.key}-lambda"
  })
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "${local.naming_prefix}-lambda-role"

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
      },
      {
        Effect = "Allow",
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
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

resource "aws_apigatewayv2_integration" "contacts" {
  for_each = var.lambda_functions

  api_id             = aws_apigatewayv2_api.contacts.id
  integration_uri    = aws_lambda_function.contacts_api_lambda_functions[each.key].invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "contacts" {
  for_each = var.lambda_functions

  api_id = aws_apigatewayv2_api.contacts.id

  route_key = "${each.value.route_method} ${each.value.route_path}"
  target    = "integrations/${aws_apigatewayv2_integration.contacts[each.key].id}"
}

resource "aws_lambda_permission" "contacts" {
  for_each = var.lambda_functions

  statement_id  = "AllowExecutionFromAPIGateway-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contacts_api_lambda_functions[each.key].function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.contacts.execution_arn}/*/*"
}

resource "aws_apigatewayv2_domain_name" "api" {
  domain_name = "api.${local.domain_name}"

  domain_name_configuration {
    certificate_arn = data.tfe_outputs.networking.nonsensitive_values.aws_acm_certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
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
