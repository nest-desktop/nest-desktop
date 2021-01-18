#!/bin/bash

. /opt/nest/bin/nest_vars.sh

export USER=root
nest-server start -h 0.0.0.0 -o
