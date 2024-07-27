#!/bin/bash

run() {
    cat test-input.txt | python3 solution.py
}

hash() {
    echo $(md5 -q test-input.txt)$(md5 -q solution.py)
}

wait_for_change()
{
    h=$(hash)
    while [ "$h" == "$(hash)" ]
    do sleep 0.1
    done
}

while true
do
    clear
    run
    wait_for_change
done