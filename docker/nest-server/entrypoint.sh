#!/bin/bash

. /opt/nest/bin/nest_vars.sh

export NEST_SERVER_MODULES=nest,numpy
export NEST_SERVER_RESTRICTION_OFF=true

uwsgi --module nest.server:app --http-socket 0.0.0.0:5000 --buffer-size 32768
