function sameEndSubstringCount(s, queries) {

    const substringsCountMemo = new Map();
    const letterCountMemo = new Map();
    const n = s.length;
    const letters = new Set(s);

    return queries.map(([l, r]) => substringsCount(l, r));

    function substringsCount(l, r = n - 1) {
        if (r < n - 1) {
            let c = substringsCount(l) - substringsCount(r + 1);

            for (const letter of letters) {
                const lc = letterCount(letter, l) - letterCount(letter, r + 1);
                c -= lc * letterCount(letter, r + 1);
            }

            return c;
        }

        if (!substringsCountMemo.has(l))
            substringsCountMemo.set(l, (() => {
                if (l >= n) return 0;

                let c = substringsCount(l + 1);

                c += letterCount(s[l], l);

                return c;
            })());

        return substringsCountMemo.get(l);
    }

    function letterCount(letter, l) {
        if (!letterCountMemo.has(letter))
            letterCountMemo.set(letter, new Map());

        if (!letterCountMemo.get(letter).has(l))
            letterCountMemo.get(letter).set(l, (() => {
                if (l >= n) return 0;

                let c = letterCount(letter, l + 1);

                if (s[l] === letter) c++;

                return c;
            })());

        return letterCountMemo.get(letter).get(l);
    }
}
