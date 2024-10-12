# Security Group for ALB
module "alb_sg" {
  source  = "terraform-aws-modules/security-group/aws//modules/alb"
  name    = "alb-sg"
  vpc_id  = var.vpc_id

  ingress_cidr_blocks = ["0.0.0.0/0"]
  egress_cidr_blocks  = ["0.0.0.0/0"]
  ingress_with_cidr_blocks = [
    {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      description = "HTTP"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      description = "HTTPS"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
}

# Security Group for ASGs (FE and API)
module "asg_sg" {
  source  = "terraform-aws-modules/security-group/aws"
  name    = "asg-sg"
  vpc_id  = var.vpc_id

  ingress_rules = ["http-3000-tcp", "http-3001-tcp"]
  egress_rules  = ["all-all"]

  ingress_cidr_blocks = ["0.0.0.0/0"]
}

# ALB (Application Load Balancer)
module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  name    = "app-alb"
  load_balancer_type = "application"
  vpc_id  = var.vpc_id
  subnets = var.public_subnets

  security_groups = [module.alb_sg.security_group_id]

  listener = [
    {
      port = 80
      protocol = "HTTP"
      action_type = "redirect"
      redirect = {
        port = "443"
        protocol = "HTTPS"
        status_code = "HTTP_301"
      }
    },
    {
      port = 443
      protocol = "HTTPS"
      ssl_policy = "ELBSecurityPolicy-2016-08"
      certificate_arn = var.acm_certificate_arn
      default_action = {
        type = "fixed-response"
        fixed_response = {
          content_type = "text/plain"
          message_body = "ALB is up"
          status_code  = 200
        }
      }
    }
  ]

  target_groups = [
    {
      name_prefix          = "fe"
      backend_protocol     = "HTTP"
      backend_port         = 3000
      target_type          = "instance"
      health_check_path    = "/"
    },
    {
      name_prefix          = "api"
      backend_protocol     = "HTTP"
      backend_port         = 3001
      target_type          = "instance"
      health_check_path    = "/"
    }
  ]
}

# Auto Scaling Group for Frontend (FE)
module "fe_asg" {
  source = "terraform-aws-modules/autoscaling/aws"
  name = "fe-asg"
  min_size = 1
  max_size = 3
  desired_capacity = 1

  vpc_zone_identifier = var.private_subnets

  # Pass user_data for downloading and running the frontend
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    service docker start
    aws s3 cp s3://your-bucket/frontend/docker-compose.yml /home/ec2-user/docker-compose.yml
    cd /home/ec2-user
    docker-compose up --build -d
  EOF

  security_groups         = [module.asg_sg.security_group_id]
  target_group_arns       = [module.alb.target_group_arns[0]]
  instance_type           = "t3.micro"
  health_check_type       = "EC2"
  health_check_grace_period = 300
  ami_id                  = var.ami_id
}

# Auto Scaling Group for Backend (API)
module "api_asg" {
  source = "terraform-aws-modules/autoscaling/aws"
  name = "api-asg"
  min_size = 1
  max_size = 3
  desired_capacity = 1

  vpc_zone_identifier = var.private_subnets

  # Pass user_data for downloading and running the API
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    service docker start
    aws s3 cp s3://your-bucket/backend/docker-compose.yml /home/ec2-user/docker-compose.yml
    cd /home/ec2-user
    docker-compose up --build -d
  EOF

  security_groups         = [module.asg_sg.security_group_id]
  target_group_arns       = [module.alb.target_group_arns[1]]
  instance_type           = "t3.micro"
  health_check_type       = "EC2"
  health_check_grace_period = 300
  ami_id                  = var.ami_id
}

