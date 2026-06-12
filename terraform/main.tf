//Este archivo es para crear una instancia EC2 en AWS usando terraform
//https://developer.hashicorp.com/terraform/tutorials/aws-get-started/aws-create

provider "aws" {
    region = "us-east-1"
}

data "aws_ami" "ubuntu" {
    most_recent = true

    filter {
        name = "name"
        values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
    }
    owners = ["099720109477"] 
}

resource "aws_instance" "novabank_instance" {
    ami                         = data.aws_ami.ubuntu.id
    instance_type               = "t3.micro"
    subnet_id                   = aws_subnet.novabank_subnet.id
    vpc_security_group_ids      = [aws_security_group.novabank_sg.id]
    associate_public_ip_address = true
    key_name = aws_key_pair.novabank_key.key_name

    tags = {
        Name = "novabank-instance"
    }
}

resource "aws_key_pair" "novabank_key" {
    key_name   = "novabank-key"
    public_key = file(var.public_key_path)
}

