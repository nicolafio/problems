function sameEndSubstringCount(s, queries) {
    const n = s.length;
    const letters = new Set(s);
    const letterCount = new Map();

    for (const letter of letters) {
        letterCount.set(letter, new Map());
        letterCount.get(letter).set(-1, 0);

        for (let r = 0; r < n; r++) {
            let c = letterCount.get(letter).get(r - 1);
            if (s[r] === letter) c++;
            letterCount.set(r, c);
        }
    }

    return queries.map(([l, r]) => substringsCount(l, r));

    function substringsCount(l, r) {
        let c = 0;

        for (const letter of letters) {
            const t = letterCount.get(letter).get(r) - letterCount.get(letter).get(l - 1);
            c += t * (t - 1) / 2;
            c += t;
        }

        return c;
    }
}
