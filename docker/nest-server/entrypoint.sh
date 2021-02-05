#!/bin/bash

. /opt/nest/bin/nest_vars.sh

export NEST_SERVER_MODULES=nest,numpy
export NEST_SERVER_RESTRICTION_OFF=true

uwsgi --module nest.server:app --buffer-size 65535 --http-socket ${1:-0.0.0.0:5000}
