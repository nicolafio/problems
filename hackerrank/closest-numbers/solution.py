#!/bin/python3

import math
import os

#
# Complete the 'closestNumbers' function below.
#
# The function is expected to return an INTEGER_ARRAY.
# The function accepts INTEGER_ARRAY arr as parameter.
#

def closestNumbers(arr):
    # Write your code here
    best = None
    smallest_difference = math.inf
    sorted_arr = sorted(arr)

    for i in range(len(arr) - 1):
        a = sorted_arr[i]
        b = sorted_arr[i + 1]
        difference = b - a

        if difference == smallest_difference:
            best.append(a)
            best.append(b)

        if difference < smallest_difference:
            smallest_difference = difference
            best = [a, b]

    return best

if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')

    n = int(input().strip())

    arr = list(map(int, input().rstrip().split()))

    result = closestNumbers(arr)

    fptr.write(' '.join(map(str, result)))
    fptr.write('\n')

    fptr.close()
