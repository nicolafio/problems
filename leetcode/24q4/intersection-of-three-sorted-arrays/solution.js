function arraysIntersection(arr1, arr2, arr3) {
    let all = Array.from(new Set([...arr1, ...arr2, ...arr3]));

    all.sort((a, b) => a - b);

    let set1 = new Set(arr1);
    let set2 = new Set(arr2);
    let set3 = new Set(arr3);
    let out = [];
    for (let x of all) {
        let valid = true;
        for (let set of [set1, set2, set3]) {
            if (!set.has(x)) {
                valid = false;
            }
        }
        if (valid) {
            out.push(x);
        }
    }
    return out;
};