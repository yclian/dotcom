# ==============================================================================
# Cloudflare HTTP Redirect Rules (www -> apex)
# ==============================================================================

resource "cloudflare_ruleset" "www_to_apex_redirect" {
  zone_id     = var.zone_id
  name        = "Redirect www to apex"
  description = "Permanent 301 redirect from www.${var.domain_name} to https://${var.domain_name}"
  kind        = "zone"
  phase       = "http_request_dynamic_redirect"

  rules {
    action = "redirect"
    action_parameters {
      from_value {
        status_code = 301
        target_url {
          expression = "concat(\"https://${var.domain_name}\", http.request.uri.path)"
        }
        preserve_query_string = true
      }
    }
    expression  = "(http.host eq \"www.${var.domain_name}\")"
    description = "Redirect www.${var.domain_name} to https://${var.domain_name}"
    enabled     = true
  }
}
