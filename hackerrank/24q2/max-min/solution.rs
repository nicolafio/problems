use std::env;
use std::fs::File;
use std::io::{self, BufRead, Write};

/*
 * Complete the 'maxMin' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. INTEGER k
 *  2. INTEGER_ARRAY arr
 */

fn maxMin(k: i32, arr: &[i32]) -> i32 {
    let n = arr.len();
    let mut sorted: Vec<i32> = arr.to_vec();
    let mut best = std::i32::MAX;

    sorted.sort();

    let k = k as usize;

    for i in 0..=(n - k) {
        let min = sorted.get(i).unwrap();
        let max = sorted.get(i + k - 1).unwrap();
        let unfairness = max - min;

        best = std::cmp::min(unfairness, best);
    }

    best
}

fn main() {
    let stdin = io::stdin();
    let mut stdin_iterator = stdin.lock().lines();

    let mut fptr = File::create(env::var("OUTPUT_PATH").unwrap()).unwrap();

    let n = stdin_iterator.next().unwrap().unwrap().trim().parse::<i32>().unwrap();

    let k = stdin_iterator.next().unwrap().unwrap().trim().parse::<i32>().unwrap();

    let mut arr: Vec<i32> = Vec::with_capacity(n as usize);

    for _ in 0..n {
        let arr_item = stdin_iterator.next().unwrap().unwrap().trim().parse::<i32>().unwrap();
        arr.push(arr_item);
    }

    let result = maxMin(k, &arr);

    writeln!(&mut fptr, "{}", result).ok();
}
