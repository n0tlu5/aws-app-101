variable "vpc_id" {
  description = "The VPC ID where the resources will be created"
  type        = string
}

variable "public_subnets" {
  description = "The public subnets for the ALB"
  type        = list(string)
}

variable "private_subnets" {
  description = "The private subnets for the Auto Scaling Groups"
  type        = list(string)
}

variable "acm_certificate_arn" {
  description = "The ARN of the ACM certificate for the ALB"
  type        = string
}

variable "ami_id" {
  description = "AMI ID to use for the EC2 instances in the Auto Scaling Groups"
  type        = string
}

