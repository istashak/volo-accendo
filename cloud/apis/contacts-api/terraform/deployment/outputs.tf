output "contacts_api_lambda_bucket_id" {
  value       = aws_s3_bucket.lambda_bucket.id
  description = "The bucket id of the S3 bucket used to store the built contacts API."
}