#!/bin/bash

jq -n \
  --arg simulator_visible "${SIMULATOR_VISIBLE}" \
  '{
    simulatorVisible: $simulator_visible
  }' > /usr/share/nginx/html/assets/args/app.json

bash /usr/local/bin/simulators/nest.sh
bash /usr/local/bin/simulators/norse.sh
bash /usr/local/bin/simulators/pynn.sh

exec "$@"
