#!/bin/bash

language="${1:-c}"

c_executable="./bin/solution"
c_source="solution.c"

cs_executable="./bin/Release/net6.0/osx-arm64/here-we-go(relians)-again"
cs_source="solution.cs"


clean() {
    rm -rf ./bin
    rm -rf ./obj
}

build() {
    if [ "$language" == "cs" ]
    then
        dotnet publish \
            --configuration Release \
            --self-contained true

        chmod +x "$cs_executable"
    fi

    if [ "$language" == "c" ]
    then
        mkdir -p "./bin"

        gcc "$c_source" \
            -o "$c_executable" \
            -O2 \
            -Wall \
            -lm \
            -std=gnu99

        chmod +x "$c_executable"
    fi
}

run() {
    if [ "$language" == "cs" ]
    then cat test-input.txt | "$cs_executable"
    fi

    if [ "$language" == "c" ]
    then cat test-input.txt | "$c_executable"
    fi
}

wait_for_source_change() {
    if [ "$language" == "cs" ]
    then source="$cs_source"
    fi

    if [ "$language" == "c" ]
    then source="$c_source"
    fi

    hash="$(md5 -q $source)"

    while [ "$hash" == "$(md5 -q $source)" ]
    do sleep 0.1
    done
}


while true
do
    clear

    clean
    build

    echo ------------------

    run

    wait_for_source_change
done
