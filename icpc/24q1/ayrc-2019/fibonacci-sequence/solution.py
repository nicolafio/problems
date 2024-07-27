import sys

def fib(n):
    if n == 1:
        return 1
    if n == 2:
        return 1
    return fib(n - 1) + fib(n - 2)

count = 5

for i in range(1, count + 1):
    sys.stdout.write(str(fib(i)))

    if i == count:
        sys.stdout.write("\n")
    else:
        sys.stdout.write(" ")