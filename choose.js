
const ICPC_LATEST_YEAR = 2022;

function pickRandomSource() {

    // HackerRank

    if (Math.random() < .8) {
        if (Math.random() < .8)
            return 'https://www.hackerrank.com/interview/preparation-kits/three-month-preparation-kit/';

        let difficulty = 'easy';
        if (Math.random() < .6) {
            difficulty = 'medium';
            if (Math.random() < .2) {
                difficulty = 'hard';
            } 
        }

        let domain = 'algorithms';
        if (Math.random() < .2) {
            domain = 'data-structures';
        }

        return `https://www.hackerrank.com/domains/${domain}?filters%5Bdifficulty%5D%5B%5D=${difficulty}`;
    };

    // ICPC

    if (Math.random() < .2)
        return 'https://icpc.global/worldfinals/past-problems';

    if (Math.random() < .6) {

        // North America & Europe

        if (Math.random() < .5) {
            console.log('Todo: choices to be expanded');
            return 'https://icpc.global/regionals/finder/na';
        }

        // https://icpc.global/regionals/finder/eu

        const region = pickRandomItem(['NW', 'SW', 'CE', 'SE', 'NE']);

        if (region === 'NW') {
            console.log('Todo: choices to be expanded');
            return 'https://icpc.global/regionals/finder/northwestern-europe';
        }

        if (region === 'SW') {
            console.log('Todo: choices to be expanded');
            return 'https://icpc.global/regionals/finder/swerc';
        }

        if (region === 'CE') {
            console.log('Todo: choices to be expanded');
            return 'https://icpc.global/regionals/finder/central-europe';
        }

        if (region === 'SE') {
            // https://icpc.global/regionals/finder/seerc
            // http://acm.ro/past.htm

            let years = new Set([...range(1995, ICPC_LATEST_YEAR - 1)]);

            years.delete(1997); // No problems published there.

            years = [...years];

            const year = pickRandomItem(years);

            if (year === 2019) return 'http://acm.ro/2019/prob/probleme2019acm.pdf';                

            console.log('Todo: choices to be expanded');
            return `http://acm.ro/${year}/problems.htm`;
        }

        if (region === 'NE') {
            console.log('Todo: choices to be expanded');
            return 'https://icpc.global/regionals/finder/northern-eurasia';
        }

    }

    if (Math.random() < .6) {
        // ICPC Russia & China...
        console.log('Todo: choices to be expanded for Russia & China');
        return 'https://icpc.global/regionals/finder';
    }

    // ICPC - rest of the world...
    console.log('Todo: choices to be expanded for regionals that are not North America, Europe, Russia, China');
    return 'https://icpc.global/regionals/finder';
}

function pickRandomLanguage(source) {
    if (Math.random() < .6) {
        if (Math.random() < .5) return 'C#';
        return 'Python';
    };
    if (Math.random() < .6) return 'C++';
    if (Math.random() < .6) return 'C';
    return 'JavaScript';
}

function pickRandomProblem(source) {
    if (source.includes('http://acm.ro/2019'))
        return pickRandomItem('ABCDEFGHIJK');
}

function pickRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function* range(min, max, increment = 1) {
    for (let i = min; i <= max; i += increment) yield i;
}

const source = pickRandomSource();
const language = pickRandomLanguage(source);
const problem = pickRandomProblem(source);

console.log(`Source: ${source}`);
console.log(`Language: ${language}`);

if (problem) console.log(`Problem: ${problem}`);
