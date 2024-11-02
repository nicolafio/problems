function sameEndSubstringCount(s, queries) {

    const letterCountMemo = new Map();
    const n = s.length;
    const letters = new Set(s);

    return queries.map(([l, r]) => substringsCount(l, r));

    function substringsCount(l, r) {
        let c = 0;

        for (const letter of letters) {
            const t = letterCount(letter, l) - letterCount(letter, r + 1);
            c += t * (t - 1) / 2;
            c += t;
        }

        return c;
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
