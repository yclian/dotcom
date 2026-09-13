# ==============================================================================
# Cloudflare DNS Configuration for yclian.com
# ==============================================================================
# CRITICAL: This file preserves all existing Google Workspace mail routing and
# Atlassian domain verification records while binding yclian.com to Cloudflare Pages.

# ------------------------------------------------------------------------------
# 1. Google Workspace Mail Routing (MX Records)
# ------------------------------------------------------------------------------
locals {
  google_mx_records = [
    { priority = 1, value = "aspmx.l.google.com" },
    { priority = 5, value = "alt1.aspmx.l.google.com" },
    { priority = 5, value = "alt2.aspmx.l.google.com" },
    { priority = 10, value = "aspmx2.googlemail.com" },
    { priority = 10, value = "aspmx3.googlemail.com" },
    { priority = 30, value = "aspmx4.googlemail.com" },
    { priority = 30, value = "aspmx5.googlemail.com" }
  ]
}

resource "cloudflare_record" "google_mx" {
  count    = length(local.google_mx_records)
  zone_id  = var.zone_id
  name     = "@"
  type     = "MX"
  content  = local.google_mx_records[count.index].value
  priority = local.google_mx_records[count.index].priority
  ttl      = 3600
  comment  = "Google Workspace mail server"
}

# ------------------------------------------------------------------------------
# 2. Email Security & Verification Records (TXT)
# ------------------------------------------------------------------------------
resource "cloudflare_record" "google_spf" {
  zone_id = var.zone_id
  name    = "@"
  type    = "TXT"
  content = "v=spf1 include:_spf.google.com ~all"
  ttl     = 3600
  comment = "Google Workspace SPF authorization"
}

resource "cloudflare_record" "dmarc" {
  zone_id = var.zone_id
  name    = "_dmarc"
  type    = "TXT"
  content = "v=DMARC1; p=none; rua=mailto:dmarc@yclian.com"
  ttl     = 3600
  comment = "DMARC policy"
}

variable "google_dkim_record" {
  description = "Google domainkey DKIM TXT record content"
  type        = string
  default     = ""
}

resource "cloudflare_record" "google_dkim" {
  count   = var.google_dkim_record != "" ? 1 : 0
  zone_id = var.zone_id
  name    = "google._domainkey"
  type    = "TXT"
  content = var.google_dkim_record
  ttl     = 3600
  comment = "Google Workspace DKIM record"
}

# Variable placeholders for existing verification TXT values to import cleanly
variable "google_site_verification" {
  description = "Existing Google site-verification token string"
  type        = string
  default     = ""
}

resource "cloudflare_record" "google_site_verification" {
  count   = var.google_site_verification != "" ? 1 : 0
  zone_id = var.zone_id
  name    = "@"
  type    = "TXT"
  content = "google-site-verification=${var.google_site_verification}"
  ttl     = 3600
  comment = "Google Search Console / Workspace domain verification"
}

variable "atlassian_verification_tokens" {
  description = "List of existing Atlassian domain verification token strings"
  type        = list(string)
  default     = []
}

resource "cloudflare_record" "atlassian_verification" {
  count   = length(var.atlassian_verification_tokens)
  zone_id = var.zone_id
  name    = "@"
  type    = "TXT"
  content = "atlassian-domain-verification=${var.atlassian_verification_tokens[count.index]}"
  ttl     = 3600
  comment = "Atlassian organization domain verification"
}

variable "atlassian_sending_domain_verification" {
  description = "Atlassian sending domain verification token"
  type        = string
  default     = ""
}

resource "cloudflare_record" "atlassian_sending_verification" {
  count   = var.atlassian_sending_domain_verification != "" ? 1 : 0
  zone_id = var.zone_id
  name    = "@"
  type    = "TXT"
  content = "atlassian-sending-domain-verification=${var.atlassian_sending_domain_verification}"
  ttl     = 3600
  comment = "Atlassian sending domain verification"
}

# ------------------------------------------------------------------------------
# 3. Web Routing: Cloudflare Pages (Apex & www)
# ------------------------------------------------------------------------------
resource "cloudflare_record" "pages_apex" {
  zone_id = var.zone_id
  name    = "@"
  type    = "CNAME"
  content = "${cloudflare_pages_project.site.name}.pages.dev"
  proxied = true
  ttl     = 1
  comment = "Cloudflare Pages apex site binding"
}

resource "cloudflare_record" "pages_www" {
  zone_id = var.zone_id
  name    = "www"
  type    = "CNAME"
  content = "${cloudflare_pages_project.site.name}.pages.dev"
  proxied = true
  ttl     = 1
  comment = "Cloudflare Pages www site binding"
}
