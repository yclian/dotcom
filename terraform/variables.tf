variable "cloudflare_api_token" {
  description = "Cloudflare API Token with DNS Edit, Pages Edit, and Zone Read permissions"
  type        = string
  sensitive   = true
}

variable "account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "zone_id" {
  description = "Cloudflare Zone ID for yclian.com"
  type        = string
}

variable "domain_name" {
  description = "Apex domain name"
  type        = string
  default     = "yclian.com"
}
