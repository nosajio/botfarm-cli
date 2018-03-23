#!/bin/bash

DIR="$(pwd)";

USERDATA="$DIR/.userdata";
LOGS="$USERDATA/.logs";
REPOS="$USERDATA/.repos";

# Build userdata & cache dirs
[[ -d $USERDATA ]] ||  (mkdir $USERDATA && echo "Create $USERDATA");
[[ -d $LOGS ]] ||  (mkdir -p $LOGS && echo "Create $LOGS"); 
[[ -d $REPOS ]] ||  (mkdir -p $REPOS && echo "Create $REPOS"); 

# Touch the stdio log files
touch "$LOGS/botfarm_stderr.log";
touch "$LOGS/botfarm_stdout.log";