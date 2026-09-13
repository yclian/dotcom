# ==============================================================================
# Cloudflare Pages Project & Custom Domains
# ==============================================================================

resource "cloudflare_pages_project" "site" {
  account_id        = var.account_id
  name              = "yclian-com"
  production_branch = "master"

  build_config {
    build_command   = "npx quartz build"
    destination_dir = "public"
    root_dir        = ""
  }

  deployment_configs {
    production {
      environment_variables = {
        NODE_VERSION = "22"
      }
    }
    preview {
      environment_variables = {
        NODE_VERSION = "22"
      }
    }
  }
}

resource "cloudflare_pages_domain" "apex" {
  account_id   = var.account_id
  project_name = cloudflare_pages_project.site.name
  domain       = var.domain_name
}

resource "cloudflare_pages_domain" "www" {
  account_id   = var.account_id
  project_name = cloudflare_pages_project.site.name
  domain       = "www.${var.domain_name}"
}
