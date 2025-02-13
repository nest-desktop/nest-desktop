#!/bin/bash

jq -n \
  --arg norse_simulator_enabled "${NORSE_SIMULATOR_ENABLED}" \
  --arg norse_simulator_path "${NORSE_SIMULATOR_PATH}" \
  --arg norse_simulator_port "${NORSE_SIMULATOR_PORT}" \
  --arg norse_simulator_url "${NORSE_SIMULATOR_URL}" \
  '{
      norse: {
        enabled: $norse_simulator_enabled,
        path: $norse_simulator_path,
        port: $norse_simulator_port,
        url: $norse_simulator_url
      }
  }' > /usr/share/nginx/html/assets/workspaces/norse/config/backends.json
