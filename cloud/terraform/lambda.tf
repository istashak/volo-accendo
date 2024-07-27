# ##################################################################################
# # LAMBDA
# ##################################################################################

# # Archive source

# data "archive_file" "lambda_source_package" {
#   type        = "zip"
#   source_dir  = "${local.contacts_api_local_path}/dist"
#   output_path = "${local.contacts_api_local_path}/.tmp/lambda.zip"
# }

# # S3 bucket for lambda

# resource "aws_s3_bucket" "lambda_bucket" {
#   bucket        = local.s3_lambda_function_bucket_name
#   force_destroy = true

#   tags = merge(local.common_tags, {
#     resource_name = "${local.naming_prefix}-s3-lambda-function-bucket"
#   })
# }

# # This ownership control seems to be necessary for the private aws_s3_bucket_acl to work.
# resource "aws_s3_bucket_ownership_controls" "lambda_bucket" {
#   bucket = aws_s3_bucket.lambda_bucket.id
#   rule {
#     object_ownership = "BucketOwnerPreferred"
#   }
# }

# resource "aws_s3_bucket_acl" "lambda_bucket" {
#   depends_on = [aws_s3_bucket_ownership_controls.lambda_bucket]
#   bucket     = aws_s3_bucket.lambda_bucket.id
#   acl        = "private"
# }

# resource "aws_s3_object" "lambda_source" {
#   bucket = aws_s3_bucket.lambda_bucket.id
#   key    = "putTaxiRequest/v${var.contacts_api_version}/lambda.zip"
#   source = data.archive_file.lambda_source_package.output_path
#   etag   = filemd5(data.archive_file.lambda_source_package.output_path)
# }

# # Lambda Function
# resource "aws_lambda_function" "contacts_api" {
#   function_name = "${local.naming_prefix}-putContacts"
#   role          = aws_iam_role.lambda_role.arn
#   handler       = "put-contacts.handler"
#   runtime       = "nodejs16.x"
#   timeout       = 60

#   # The bucket name as created earlier with "aws s3api create-bucket"
#   s3_bucket = aws_s3_bucket.lambda_bucket.id
#   s3_key    = aws_s3_object.lambda_source.key

#   environment {
#     variables = {
#       NODE_ENV   = var.environment
#       TABLE_NAME = aws_dynamodb_table.contact_table.name
#     }
#   }

#   tags = merge(local.common_tags, {
#     resource_name = "${local.naming_prefix}-contacts-lambda"
#   })
# }

# # IAM Role for Lambda
# resource "aws_iam_role" "lambda_role" {
#   name = "lambda_role"

#   assume_role_policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Sid    = "LambdaExecutionRole"
#         Effect = "Allow",
#         Principal = {
#           Service = "lambda.amazonaws.com"
#         },
#         Action = "sts:AssumeRole"
#       }
#     ]
#   })

#   tags = merge(local.common_tags, {
#     resource_name = "${local.naming_prefix}-lambda-role"
#   })
# }

# resource "aws_iam_role_policy" "lambda_role_policy" {
#   name = "${local.naming_prefix}-lambda-dynamodb-access-policy"
#   role = aws_iam_role.lambda_role.id

#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Effect = "Allow",
#         Action = [
#           "dynamodb:Query",
#           "dynamodb:Scan",
#           "dynamodb:GetItem",
#           "dynamodb:PutItem",
#           "dynamodb:UpdateItem",
#           "dynamodb:DeleteItem"
#         ],
#         Resource = "${aws_dynamodb_table.contact_table.arn}"
#       },
#       {
#         Effect = "Allow",
#         Action = [
#           "logs:CreateLogGroup",
#           "logs:CreateLogStream",
#           "logs:DescribeLogStreams",
#           "logs:PutLogEvents"
#         ],
#         Resource = "*"
#       }
#     ],
#   })
# }