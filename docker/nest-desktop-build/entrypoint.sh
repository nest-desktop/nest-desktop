#!/bin/bash

jq -n \
  --arg simulator_visible "${SIMULATOR_VISIBLE}" \
  '{
    simulatorVisible: $simulator_visible
  }' > /usr/share/nginx/html/assets/app.json

bash /usr/local/bin/workspaces/nest.sh
bash /usr/local/bin/workspaces/norse.sh
bash /usr/local/bin/workspaces/pynn.sh

exec "$@"
