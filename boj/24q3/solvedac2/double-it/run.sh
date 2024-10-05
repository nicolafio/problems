#!/bin/bash

set -eu

csproj_file=$(ls | grep -E "\.csproj$" | head -n 1)

if [ -z "$csproj_file" ]
then
    echo .csproj file not found in $PWD
    exit 1
fi

binary_name=$(basename "$csproj_file" .csproj)

dotnet publish \
    --configuration Release \
    --self-contained true \
    --verbosity quiet

cat input.txt | ./bin/Release/net6.0/linux-x64/publish/$binary_name

