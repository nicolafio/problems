#!/bin/python3

import math
import os
import random
import re
import sys

#
# Complete the 'migratoryBirds' function below.
#
# The function is expected to return an INTEGER.
# The function accepts INTEGER_ARRAY arr as parameter.
#

def migratoryBirds(arr):
    # Write your code here
    counts = dict()

    for typeId in arr:
        if typeId not in counts:
            counts[typeId] = 0
        counts[typeId] += 1

    types = sorted(set(arr))
    maxCount = -1
    mostFrequentType = -1

    for typeId in types:
        if counts[typeId] > maxCount:
            maxCount = counts[typeId]
            mostFrequentType = typeId
    
    return mostFrequentType

if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')

    arr_count = int(input().strip())

    arr = list(map(int, input().rstrip().split()))

    result = migratoryBirds(arr)

    fptr.write(str(result) + '\n')

    fptr.close()
