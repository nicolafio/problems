#!/bin/python3

import math
import os
import random
import re
import sys



#
# Complete the 'flippingMatrix' function below.
#
# The function is expected to return an INTEGER.
# The function accepts 2D_INTEGER_ARRAY matrix as parameter.
#

def flippingMatrix(matrix):
    # Write your code here
    # Greedy approach
    n = len(matrix)
    firstHalf = range(int(n / 2))
    secondHalf = range(n - int(n / 2), n)
    settled = False
    i = 0
    orientation = 0
    index = 0
    while not settled:
        settled = True
        for i in range(n):
            leftRowSum =        sum([matrix[i][j] for j in firstHalf])
            rightRowSum =       sum([matrix[i][j] for j in secondHalf])
            if rightRowSum > leftRowSum:
                settled = False
                flippedRow = [matrix[i][n - j - 1] for j in range(n)]
                for j in range(n):
                    matrix[i][j] = flippedRow[j]

            topColumnSum =      sum([matrix[j][i] for j in firstHalf])
            bottomColumnSum =   sum([matrix[j][j] for j in secondHalf])
            if bottomColumnSum > topColumnSum:
                settled = False
                flippedColumn = [matrix[n - j - 1][i] for j in range(n)]
                for j in range(n):
                    matrix[j][i] = flippedColumn[j]

    return sum([matrix[i][j] for i in firstHalf for j in firstHalf])

if __name__ == '__main__':
    fptr = open(os.environ['OUTPUT_PATH'], 'w')

    q = int(input().strip())

    for q_itr in range(q):
        n = int(input().strip())

        matrix = []

        for _ in range(2 * n):
            matrix.append(list(map(int, input().rstrip().split())))

        result = flippingMatrix(matrix)

        fptr.write(str(result) + '\n')

    fptr.close()
