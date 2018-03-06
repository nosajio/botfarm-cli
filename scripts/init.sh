#!/bin/bash

USERDATA=".userdata";
LOGS="$USERDATA/.logs";

# Build userdata & cache dirs
[[ -d $USERDATA ]] ||  (mkdir $USERDATA && echo "Create $USERDATA");
[[ -d $LOGS ]] ||  (mkdir -p $LOGS && echo "Create $LOGS"); 