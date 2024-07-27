#!/bin/bash

binary=./bin/solution
input_file=./input.txt
source=./solution.c

clean() {
    rm -rf bin
}

build() {
    mkdir -p bin

    gcc "$source" \
        -o "$binary" \
        -O2 \
        -Wall \
        -lm \
        -std=gnu99

    chmod +x $binary
}

run() {
    cat $input_file | $binary
}

hash_source() {
    echo "$(md5 -q $source)$(md5 -q $input_file)"
}

wait_for_change() {
    hash=$(hash_source)
    while [ $hash == $(hash_source) ]
    do sleep .1
    done
}

while true
do
    clear
    clean
    build
    run
    wait_for_change
done


