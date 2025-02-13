#!/bin/bash

jq -n \
  --arg currentWorkspace "${CURRENT_WORKSPACE}" \
  '{
    currentWorkspace: $currentWorkspace
  }' > /usr/share/nginx/html/assets/app.json

bash /usr/local/bin/workspaces/nest.sh
bash /usr/local/bin/workspaces/norse.sh
bash /usr/local/bin/workspaces/pynn.sh

exec "$@"
