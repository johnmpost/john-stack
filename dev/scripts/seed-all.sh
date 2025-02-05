zitadel_is_ready=$(curl -o /dev/null -s -w "%{http_code}" "http://localhost:5003/debug/ready" | grep -q '^200$' && echo true || echo false)
if [ "$zitadel_is_ready" = "false" ]; then
  echo "Zitadel is not ready yet. Exiting without seeding."
  exit 1
fi

admin_credentials_json=$(podman cp johnstack_idp_zitadel_1:/machinekey/zitadel-admin-sa.json - | tar -xO)

terraform -chdir=./dev/tf apply -var="admin_credentials_json=$admin_credentials_json"

ENV_FILE=".env.seed"

# used in app code
echo "X_ZITADEL_CLIENT_ID_BROWSER_APP=$(terraform -chdir=./dev/tf output -raw client_app_client_id)" > $ENV_FILE
echo "ZITADEL_CLIENT_ID_API_SERVICE=$(terraform -chdir=./dev/tf output -raw api_app_client_id)" >> $ENV_FILE
echo "ZITADEL_CLIENT_SECRET_API_SERVICE=$(terraform -chdir=./dev/tf output -raw api_app_client_secret)" >> $ENV_FILE

# used in seed scripts
echo "JOHN_STACK_CO_ID=$(terraform -chdir=./dev/tf output -raw john_stack_co_id)" >> $ENV_FILE
echo "WAYNE_ENTERPRISES_ID=$(terraform -chdir=./dev/tf output -raw wayne_enterprises_id)" >> $ENV_FILE
echo "JOHN_POST_ID=$(terraform -chdir=./dev/tf output -raw john_post_id)" >> $ENV_FILE
echo "BRUCE_WAYNE_ID=$(terraform -chdir=./dev/tf output -raw bruce_wayne_id)" >> $ENV_FILE
echo "ALFRED_PENNYWORTH_ID=$(terraform -chdir=./dev/tf output -raw alfred_pennyworth_id)" >> $ENV_FILE

# run the db seed script
echo "seeding db..."
tsx --env-file=.env.static --env-file=.env.seed ./dev/scripts/seed-db.ts
echo "finished seeding db."
