terraform {
  required_providers {
    zitadel = {
      source  = "zitadel/zitadel"
      version = "2.0.2"
    }
  }
}

provider "zitadel" {
  domain           = "localhost"
  insecure         = "true"
  port             = "5003"
  jwt_profile_json = "{\"client_id\": \"zitadel-admin\", \"client_secret\": \"Password1!\"}"
}


resource "zitadel_org" "john_stack_co" {
    name = "john-stack-co"
}

resource "zitadel_project" "john_stack" {
  name                     = "john-stack"
  org_id                   = zitadel_org.john_stack_co.id
  project_role_assertion   = true
  has_project_check        = true
  private_labeling_setting = "PRIVATE_LABELING_SETTING_ENFORCE_PROJECT_RESOURCE_OWNER_POLICY"
}

resource "zitadel_application_oidc" "client_app" {
  project_id = zitadel_project.john_stack.id
  org_id     = zitadel_org.john_stack_co.id

  name                         = "client-app"
  redirect_uris                = ["http://localhost:5002/callback"]
  response_types               = ["OIDC_RESPONSE_TYPE_CODE"]
  grant_types                  = ["OIDC_GRANT_TYPE_AUTHORIZATION_CODE"]
  post_logout_redirect_uris    = ["http://localhost:5002/"]
  app_type                     = "OIDC_APP_TYPE_WEB"
  auth_method_type             = "OIDC_AUTH_METHOD_TYPE_BASIC"
  version                      = "OIDC_VERSION_1_0"
  clock_skew                   = "0s"
  dev_mode                     = true
  access_token_type            = "OIDC_TOKEN_TYPE_BEARER"
  access_token_role_assertion  = false
  id_token_role_assertion      = false
  id_token_userinfo_assertion  = false
  additional_origins           = []
  skip_native_app_success_page = false
}

resource "zitadel_application_api" "api_app" {
  project_id       = zitadel_project.john_stack.id
  org_id           = zitadel_org.john_stack_co.id
  name             = "api-app"
  auth_method_type = "API_AUTH_METHOD_TYPE_BASIC"
}

resource "zitadel_org" "wayne_enterprises" {
    name = "wayne-enterprises"
}

resource "zitadel_human_user" "john_post" {
  org_id             = zitadel_org.john_stack_co.id
  user_name          = "john@john-stack-co.com"
  first_name         = "John"
  last_name          = "Post"
  nick_name          = "John"
  email              = "john@john-stack-co.com"
  is_email_verified  = true
  initial_password   = "Password1!"
}

resource "zitadel_human_user" "bruce_wayne" {
  org_id             = zitadel_org.wayne_enterprises.id
  user_name          = "bruce@wayne-enterprises.com"
  first_name         = "Bruce"
  last_name          = "Wayne"
  nick_name          = "Batman"
  email              = "bruce@wayne-enterprises.com"
  is_email_verified  = true
  initial_password   = "Password1!"
}

resource "zitadel_human_user" "alfred_pennyworth" {
  org_id             = zitadel_org.wayne_enterprises.id
  user_name          = "alfred@wayne-enterprises.com"
  first_name         = "Alfred"
  last_name          = "Pennyworth"
  nick_name          = "Alfred"
  email              = "alfred@wayne-enterprises.com"
  is_email_verified  = true
  initial_password   = "Password1!"
}

output "client_app_client_id" {
    value = zitadel_application_oidc.client_app.client_id
    sensitive = true
}

output "api_app_client_id" {
    value = zitadel_application_api.api_app.client_id
    sensitive = true
}

output "api_app_client_secret" {
    value = zitadel_application_api.api_app.client_secret
    sensitive = true
}

output "john_stack_co_id" {
  value = zitadel_org.john_stack_co.id
}

output "wayne_enterprises_id" {
  value = zitadel_org.wayne_enterprises.id
}

output "john_post_id" {
  value = zitadel_human_user.john_post.id
}

output "bruce_wayne_id" {
  value = zitadel_human_user.bruce_wayne.id
}

output "alfred_pennyworth_id" {
  value = zitadel_human_user.alfred_pennyworth.id
}
