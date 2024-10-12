output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer"
  value       = module.alb.this_lb_dns_name
}

