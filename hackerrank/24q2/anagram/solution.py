#!/bin/python3

import math
import os
import random
import re
import sys



#
# Complete the 'anagram' function below.
#
# The function is expected to return an INTEGER.
# The function accepts STRING s as parameter.
#

def anagram(s):
    # Write your code here
    n = len(s)

    if n % 2 != 0:
        return -1

    n = int(n / 2)

    left = s[:n]
    right = s[n:]

    count_l = dict()
    count_r = dict()

    sides = [left, right]
    counts = [count_l, count_r]

    for side, count in zip(sides, counts):
        for c in side:
            if c not in count:
                count[c] = 0
            count[c] += 1

    changes = 0

    for c in count_l.keys():
        if c not in count_r:
            count_r[c] = 0
        v = min(count_l[c], count_r[c])
        changes += count_l[c] - v

    return changes

if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')

    q = int(input().strip())

    for q_itr in range(q):
        s = input()

        result = anagram(s)

        fptr.write(str(result) + '\n')

    fptr.close()