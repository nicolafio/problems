import math
import os
import random
import re
import sys

def dividing_candy(n, a):
    pass

fptr = open(os.environ['OUTPUT_PATH'], 'w')
n = int(input().strip())
a = list(map(int, input().rstrip().split()))
result = dividing_candy(a)
fptr.write(str(result) + '\n')
fptr.close()
