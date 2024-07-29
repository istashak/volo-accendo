output "s3_web_app_bucket_name" {
  value = aws_s3_bucket.web_app_bucket.bucket
}

output "cloudfront_distribution_domain_name" {
  value = aws_cloudfront_distribution.web_app_distribution.domain_name
}

output "hello_base_url" {
  value = "${aws_apigatewayv2_stage.contacts.invoke_url}/contacts"
}

output "custom_domain_api" {
  value = "https://${aws_apigatewayv2_api_mapping.api.domain_name}"
}

output "custom_domain_api_v1" {
  value = "https://${aws_apigatewayv2_api_mapping.api_v1.domain_name}/${aws_apigatewayv2_api_mapping.api_v1.api_mapping_key}"
}

# output "contacts_deployment_invoke_url" {
#   value = aws_api_gateway_deployment.contacts_api_deployment.invoke_url
# }