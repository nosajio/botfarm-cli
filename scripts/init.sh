#!/bin/bash

USERDATA=".userdata";
CACHE="$USERDATA/.cache";
LOGS="$USERDATA/.logs";

# Build userdata & cache dirs
[[ -d $USERDATA ]] ||  (mkdir $USERDATA && echo "Create $USERDATA");
[[ -d $CACHE ]] ||  (mkdir -p $CACHE && echo "Create $CACHE"); 
[[ -d $LOGS ]] ||  (mkdir -p $LOGS && echo "Create $LOGS"); 