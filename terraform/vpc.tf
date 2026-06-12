##https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/vpc

resource "aws_vpc" "novabank_vpc" {
    cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "novabank_subnet" {
    vpc_id = aws_vpc.novabank_vpc.id
    cidr_block = "10.0.1.0/24"
}

resource "aws_internet_gateway" "novabank_igw" {
    vpc_id = aws_vpc.novabank_vpc.id
}

resource "aws_route_table" "novabank_route_table" {
    vpc_id = aws_vpc.novabank_vpc.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.novabank_igw.id
    }
}

resource "aws_route_table_association" "novabank_route_table_association" {
    subnet_id = aws_subnet.novabank_subnet.id
    route_table_id = aws_route_table.novabank_route_table.id
}

resource "aws_security_group" "novabank_sg" {
    name = "novabank_sg"
    description = "Allow SSH and HTTP"
    vpc_id = aws_vpc.novabank_vpc.id

    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port = 4000
        to_port = 4000
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port = 3001
        to_port = 3001
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = 9090
        to_port = 9090
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = 9100
        to_port = 9100
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

}