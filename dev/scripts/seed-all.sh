admin_credentials_json=$(podman cp johnstack_idp_zitadel_1:/machinekey/zitadel-admin-sa.json - | tar -xO)

terraform -chdir=./dev/tf apply -var="admin_credentials_json=$admin_credentials_json"

export CLIENT_APP_CLIENT_ID=$(terraform output -raw client_app_client_id)
export API_APP_CLIENT_ID=$(terraform output -raw api_app_client_id)
export API_APP_CLIENT_SECRET=$(terraform output -raw api_app_client_secret)

export JOHN_STACK_CO_ID=$(terraform output -raw john_stack_co_id)
export WAYNE_ENTERPRISES_ID=$(terraform output -raw wayne_enterprises_id)

export JOHN_POST_ID=$(terraform output -raw john_post_id)
export BRUCE_WAYNE_ID=$(terraform output -raw bruce_wayne_id)
export ALFRED_PENNYWORTH_ID=$(terraform output -raw alfred_pennyworth_id)

# run the db seed script
