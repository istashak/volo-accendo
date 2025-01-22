# Create a Kinesis Data Stream
resource "aws_kinesis_stream" "cloudfront_log_stream" {
  name             = "cloudfront-logs-stream-${var.environment}"
  shard_count      = 1
  retention_period = 24 # Retain logs for 24 hours
}

data "aws_iam_policy_document" "kinesis_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "kinesis" {
  name               = "cloudfront-realtime-log-config-kinesis-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.kinesis_assume_role.json
}

data "aws_iam_policy_document" "kinesis" {
  statement {
    effect = "Allow"

    actions = [
      "kinesis:DescribeStreamSummary",
      "kinesis:DescribeStream",
      "kinesis:PutRecord",
      "kinesis:PutRecords",
    ]

    resources = [aws_kinesis_stream.cloudfront_log_stream.arn]
  }
}

resource "aws_iam_role_policy" "kinesis" {
  name   = "cloudfront-realtime-log-config-kinesis--${var.environment}"
  role   = aws_iam_role.kinesis.id
  policy = data.aws_iam_policy_document.kinesis.json
}

resource "aws_cloudfront_realtime_log_config" "kinesis" {
  name          = "cloudfront-realtime-logs-${var.environment}"
  sampling_rate = 75
  fields        = ["timestamp", "c-ip"]

  endpoint {
    stream_type = "Kinesis"

    kinesis_stream_config {
      role_arn   = aws_iam_role.kinesis.arn
      stream_arn = aws_kinesis_stream.cloudfront_log_stream.arn
    }
  }

  depends_on = [aws_iam_role_policy.kinesis]
}