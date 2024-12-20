resource "aws_lambda_function" "nextjs_ssr" {
  function_name    = "${local.naming_prefix}-nextjs-ssr"
  handler          = "lambdas/nextjs-ssr.handler"
  runtime          = "nodejs20.x"
  role             = aws_iam_role.lambda_edge_role.arn
  publish          = true

  # S3 bucket and object info
  s3_bucket         = aws_s3_bucket.web_app_bucket.id
  s3_key            = aws_s3_object.web_app_lambda_edge.key
  s3_object_version = aws_s3_object.web_app_lambda_edge.version_id
}

resource "aws_iam_role" "lambda_edge_role" {
  name = "${local.naming_prefix}-lambda-edge-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action    = "sts:AssumeRole",
        Effect    = "Allow",
        Principal = { Service = ["lambda.amazonaws.com", "edgelambda.amazonaws.com"] }
      }
    ]
  })

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-lambda-edge-role"
  })
}

resource "aws_iam_role_policy" "lambda_role_policy" {
  name = "${local.naming_prefix}-lambda-edge-policy"
  role = aws_iam_role.lambda_edge_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
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
