#!/bin/bash

. /opt/nest/bin/nest_vars.sh

export USER=root
export NEST_SERVER_MODULES=nest,numpy
export NEST_SERVER_RESTRICTION_OFF=true

nest-server start -h 0.0.0.0 -o
