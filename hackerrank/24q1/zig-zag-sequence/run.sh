source=solution.py
test_file=test.txt

run() {
    cat $test_file | python3 $source
}

get_checksum() {
    echo "$(md5 -q $source)$(md5 -q $test_file)"
}

wait_for_change() {
    checksum="$(get_checksum)"

    while [ $checksum == "$(get_checksum)" ]
    do sleep 0.1
    done
}

while true
do
    clear
    run
    wait_for_change
done