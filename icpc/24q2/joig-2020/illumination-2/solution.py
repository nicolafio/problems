import math

N = int(input())
A = [v == '1' for v in input().split(' ')]

# Using memoization approach to accomplish O(N) computation.

# The value memo_on_from_left[i] answers this question:
# Let the first i bulbs be on, how many of these bulbs should be turned off
# to match the first i bulbs from the desired pattern?
memo_on_from_left = [None] * (N + 1)

# The value memo_off_from_right[i], on the other hand, answers this:
# Let the last i bulbs be off, how many of these bulbs should be turned on
# to match the last i bulbs from the desired pattern?
memo_off_from_right = [None] * (N + 1)

# Trivially, if we let there be 0 bulbs, we need to do 0 operations.
memo_on_from_left[0] = 0
memo_off_from_right[0] = 0

for i in range(1, N + 1):
    # We solve the memos by recursive definition.
    memo_on_from_left[i] = memo_on_from_left[i - 1] + (1 if not A[i - 1] else 0)
    memo_off_from_right[i] = memo_off_from_right[i - 1] + (1 if A[N - i] else 0)

best = math.inf

# Now, we solve the real problem by evaluating all r values.
for r in range(N + 1):
    on_from_left = r
    off_from_right = N - r
    ops = memo_on_from_left[on_from_left] + memo_off_from_right[off_from_right]
    if ops < best:
        best = ops

print(best)
