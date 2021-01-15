#!/bin/bash

# NEST environment
source /opt/nest/bin/nest_vars.sh

# Start NEST Server
nest-server start -d -h 0.0.0.0 -u nest

# Start NEST Desktop
nest-desktop start -h 0.0.0.0
