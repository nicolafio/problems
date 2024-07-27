#!/bin/python3

#
# Complete the 'separateNumbers' function below.
#
# The function accepts STRING s as parameter.
#

def separateNumbers(s):
    # Write your code here
    n = len(s)

    for i in range(int(n / 2)):
        first_number = int(s[:i + 1])

        if isBeautiful(s, first_number):
            print(f"YES {first_number}")
            return

    print("NO")

def isBeautiful(s, i):
    j = i
    k = 0
    n = len(s)

    while k < n:
        j_str = str(j)
        next_k = k + len(j_str)

        if s[k] == "0":
            return False

        if next_k > n:
            return False

        if s[k:next_k] != j_str:
            return False

        j += 1
        k = next_k

    return True

if __name__ == '__main__':
    q = int(input().strip())

    for q_itr in range(q):
        s = input()

        separateNumbers(s)
