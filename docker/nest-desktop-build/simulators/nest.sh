#!/bin/bash

jq -n \
  --arg insite_access_enabled "${INSITE_ACCESS_ENABLED}" \
  --arg insite_access_path "${INSITE_ACCESS_PATH}" \
  --arg insite_access_port "${INSITE_ACCESS_PORT}" \
  --arg insite_access_url "${INSITE_ACCESS_URL}" \
  --arg nest_simulator_enabled "${NEST_SIMULATOR_ENABLED:-1}" \
  --arg nest_simulator_path "${NEST_SIMULATOR_PATH}" \
  --arg nest_simulator_port "${NEST_SIMULATOR_PORT}" \
  --arg nest_simulator_url "${NEST_SIMULATOR_URL}" \
  --arg nestml_server_enabled "${NESTML_SERVER_ENABLED}" \
  --arg nestml_server_path "${NESTML_SERVER_PATH}" \
  --arg nestml_server_port "${NESTML_SERVER_PORT}" \
  --arg nestml_server_url "${NESTML_SERVER_URL}" \
  '{
      insite: {
        enabled: $insite_access_path,
        path: $insite_access_path,
        port: $insite_access_port,
        url: $insite_access_url
      },
      nest: {
        enabled: $nest_simulator_enabled,
        path: $nest_simulator_path,
        port: $nest_simulator_port,
        url: $nest_simulator_url
      },
      nestml: {
        enabled: $nestml_server_enabled,
        path: $nestml_server_path,
        port: $nestml_server_port,
        url: $nestml_server_url
      }
  }' > /usr/share/nginx/html/assets/simulators/nest/config/backends.json