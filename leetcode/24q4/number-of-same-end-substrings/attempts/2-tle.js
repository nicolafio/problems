function sameEndSubstringCount(s, queries) {

    const substringsCountMemo = new Map();
    const letterCountMemo = new Map();

    return queries.map(([l, r]) => substringsCount(l, r));

    function substringsCount(l, r) {
        if (!substringsCountMemo.has(l))
            substringsCountMemo.set(l, new Map());

        if (!substringsCountMemo.get(l).has(r))
            substringsCountMemo.get(l).set(r, (() => {
                if (l === r) return 1;

                let c = substringsCount(l + 1, r);

                c += letterCount(s[l], l, r);

                return c;
            })());

        return substringsCountMemo.get(l).get(r);
    }

    function letterCount(letter, l, r) {
        if (!letterCountMemo.has(letter))
            letterCountMemo.set(letter, new Map());

        if (!letterCountMemo.get(letter).has(l))
            letterCountMemo.get(letter).set(l, new Map());

        if (!letterCountMemo.get(letter).get(l).has(r))
            letterCountMemo.get(letter).get(l).set(r, (() => {
                if (l === r) {
                    if (s[l] === letter) return 1;
                    return 0;
                }

                let c = letterCount(letter, l + 1, r);

                if (s[l] === letter) c++;

                return c;
            })());

        return letterCountMemo.get(letter).get(l).get(r);
    }
}
