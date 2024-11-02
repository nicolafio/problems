let memo = new Map();

var climbStairs = function (n) {
    if (n == 1) return 1;
    if (n == 2) return 2;
    if (memo.has(n)) return memo.get(n);
    let count = 0;
    count += climbStairs(n - 1);
    count += climbStairs(n - 2);
    memo.set(n, count);
    return count;
};