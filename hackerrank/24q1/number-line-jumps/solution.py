#!/bin/python3

import math
import os
import random
import re
import sys

#
# Complete the 'kangaroo' function below.
#
# The function is expected to return a STRING.
# The function accepts following parameters:
#  1. INTEGER x1
#  2. INTEGER v1
#  3. INTEGER x2
#  4. INTEGER v2
#

def kangaroo(x1, v1, x2, v2):
    # Write your code here
    # Let p1(t) = x1 + t * v1 be the position of first kangaroo at time t.
    # Let p2(t) = x2 + t * v2 be the position of second kangaroo at time t.
    #
    # p1(t) = p2(t) if, and only if, t = (x2 - x1) / (v1 - v2).
    #
    # The two kangaroos can end up at the same position at the same time
    # if t exists, is positive, and is an integer.

    dividend = x2 - x1

    if dividend == 0:
        # Both kangaroos start at the same location.
        return 'YES'

    divisor = v1 - v2

    if divisor == 0:
        # Division by zero. t doesn't exist.
        return 'NO'

    # 1: positive sign, -1: negative sign.
    dividend_sign = 1 if dividend >= 0 else -1
    divisor_sign = 1 if divisor >= 0 else -1
    division_sign = dividend_sign * divisor_sign

    if division_sign == -1:
        return 'NO'

    remainder = abs(dividend) % abs(divisor)

    if remainder > 0:
        return 'NO'

    return 'YES'

if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')

    first_multiple_input = input().rstrip().split()

    x1 = int(first_multiple_input[0])

    v1 = int(first_multiple_input[1])

    x2 = int(first_multiple_input[2])

    v2 = int(first_multiple_input[3])

    result = kangaroo(x1, v1, x2, v2)

    fptr.write(result + '\n')

    fptr.close()
