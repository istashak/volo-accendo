##################################################################################
# DATA
##################################################################################

data "aws_availability_zones" "available" {
  state = "available"
}

##################################################################################
# RESOURCES
##################################################################################

# NETWORKING #
resource "aws_vpc" "volo_accendo_vpc" {
  cidr_block           = var.vpc_cidr_block
  enable_dns_hostnames = true

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-vpc"
  })
}

resource "aws_subnet" "public_subnets" {
  vpc_id                  = aws_vpc.volo_accendo_vpc.id
  count                   = var.vpc_public_subnet_count
  cidr_block              = cidrsubnet(var.vpc_cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-public-subnet"
  })
}

resource "aws_internet_gateway" "vpc_gateway" {
  vpc_id = aws_vpc.volo_accendo_vpc.id

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-gateway"
  })
}

# ROUTING #
resource "aws_route_table" "vpc_routing_table" {
  vpc_id = aws_vpc.volo_accendo_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.vpc_gateway.id
  }

  tags = merge(local.common_tags, {
    resource_name = "${local.naming_prefix}-route-table"
  })
}

resource "aws_route_table_association" "app_subnets" {
  count          = var.vpc_public_subnet_count
  subnet_id      = aws_subnet.public_subnets[count.index].id
  route_table_id = aws_route_table.vpc_routing_table.id
}


