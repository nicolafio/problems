function countGoodStrings(low, high, zero, one) {
    let memo = new Map();

    return _count(0);

    function _count(start) {
        if (!memo.has(start)) memo.set(start, __count(start));
        return memo.get(start);
    }

    function __count(start) {
        if (start > high) return 0;
        let count = 0;
        if (start >= low) count++;
        count += _count(start + zero);
        count += _count(start + one);
        return count % (10 ** 9 + 7);
    }
}
