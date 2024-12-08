##################################################################################
# DYNAMODB
##################################################################################

resource "aws_dynamodb_table" "contacts_table" {
  name         = "${var.dynamodb_table_name}-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "email"

  attribute {
    name = "email"
    type = "S"
  }

  attribute {
    name = "phone_number"
    type = "S"
  }

  global_secondary_index {
    name            = "PhoneNumberIndex"
    hash_key        = "phone_number"
    projection_type = "ALL"
  }

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-dynamodb-table"
  })
}
