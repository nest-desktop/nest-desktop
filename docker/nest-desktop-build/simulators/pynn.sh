#!/bin/bash

jq -n \
  --arg pynn_simulator_enabled "${PYNN_SIMULATOR_ENABLED}" \
  --arg pynn_simulator_path "${PYNN_SIMULATOR_PATH}" \
  --arg pynn_simulator_port "${PYNN_SIMULATOR_PORT}" \
  --arg pynn_simulator_url "${PYNN_SIMULATOR_URL}" \
  '{
      pynn: {
        enabled: $pynn_simulator_enabled,
        path: $pynn_simulator_path,
        port: $pynn_simulator_port,
        url: $pynn_simulator_url
      }
  }' > /usr/share/nginx/html/assets/simulators/pynn/config/backends.json
