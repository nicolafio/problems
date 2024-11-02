function sameEndSubstringCount(s, queries) {

    const memo = new Map();

    return queries.map(([l, r]) => count(l, r));

    function count(l, r) {
        if (!memo.has(l))
            memo.set(l, new Map());

        if (!memo.get(l).has(r))
            memo.get(l).set(r, (() => {
                if (l === r) return 1;

                let c = count(l + 1, r);

                for (let i = l; i <= r; i++) {
                    if (s[l] === s[i]) c++;
                }

                return c;
            })());

        return memo.get(l).get(r);
    }
}
