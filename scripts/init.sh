#!/bin/bash

USERDATA=".userdata";
LOGS="$USERDATA/.logs";
REPOS="$USERDATA/.repos";

# Build userdata & cache dirs
[[ -d $USERDATA ]] ||  (mkdir $USERDATA && echo "Create $USERDATA");
[[ -d $LOGS ]] ||  (mkdir -p $LOGS && echo "Create $LOGS"); 
[[ -d $REPOS ]] ||  (mkdir -p $REPOS && echo "Create $REPOS"); 