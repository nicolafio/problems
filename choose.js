
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
    // https://icpcarchive.github.io/

    if (Math.random < .8) {
        // Use the Korean online judge. 

        const firstIndex = 1000;
        const lastIndex = 31415;
        const problemRange = lastIndex - firstIndex + 1;
        const problem = firstIndex + Math.floor(Math.random() * problemRange);

        console.log(`Todo: find out automatically if there are problems later than #${lastIndex}`);

        return `https://www.acmicpc.net/problem/${problem}`;
    }

    // Use the dedicated websites for ICPC world / regional problems.

    if (Math.random() < .2)
        return 'https://icpc.global/worldfinals/past-problems';

    if (Math.random() < .6 ) {

        // North America & Europe

        if (Math.random() < .5 ) {
            // https://icpc.global/regionals/finder/na

            const region = pickRandomItem([
                'Pacific Northwest',
                'Rocky Mountain',
                'North Central',
                'East Central',
                'Northeastern',
                'New York',
                'Mid Atlantic',
                'Southest',
                'Mid Central',
                'South Central',
                'Southern California'
            ]);

            if (region === 'Mid Central') {
                // https://icpc.global/regionals/finder/Mid-Central-USA
                // https://na.icpc.global/mcna/archive/
                // https://www.acmicpc.net/category/37

                const years = new Set([...range(1995, ICPC_LATEST_YEAR)]);
                years.delete(2020);
                years.delete(2021);
                
                const year = pickRandomItem([...years]);
                
                if (year === 2007) {
                    // Using the Korean archive since the official one is
                    // offline at the time of writing this.

                    // https://www.acmicpc.net/category/detail/145

                    const problem = pickRandomItem('ABCDEFGH');

                    if (problem === 'A') return 'https://www.acmicpc.net/problem/4605';
                    if (problem === 'B') return 'https://www.acmicpc.net/problem/4606';
                    if (problem === 'C') return 'https://www.acmicpc.net/problem/4607';
                    if (problem === 'D') return 'https://www.acmicpc.net/problem/4608';
                    if (problem === 'E') return 'https://www.acmicpc.net/problem/4609';
                    if (problem === 'F') return 'https://www.acmicpc.net/problem/4610';
                    if (problem === 'G') return 'https://www.acmicpc.net/problem/4611';
                    if (problem === 'H') return 'https://www.acmicpc.net/problem/4612';
                }

                console.log(`Todo: choices to be expanded for MCNA ${year}`);
            }

            console.log(`Todo: choices to be expanded for North America ${region}`);

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
        // Asia Pacific
        // https://icpc.global/regionals/finder/apsep

        console.log('Todo: choices to be expanded for Asia Pacific');
        return 'https://icpcarchive.github.io/';
    }

    if (Math.random() < .6) {
        // Asia East
        // https://icpc.global/regionals/finder/AEC

        const city = pickRandomItem([
            'Hangzhou',
            'Hefei',
            'Hongkong',
            'Jinan',
            'Macau',
            'Nanjing',
            'Shanghai',
            'Shenyang',
            'Yinchuan',
        ]);

        if (city === 'Yinchuan') {
            // https://icpcarchive.github.io/Yinchuan.html
            // Only 2019 is present.

            console.log('For Yinchuan, are there newer contests than 2019?');
            console.log('Refer to https://icpcarchive.github.io/Yinchuan.html')

            return `file://${__dirname}/icpc/ayrc-2019/problems.pdf`;
        }

        console.log('Todo: choices to be expanded for Asia East');
        return 'https://icpcarchive.github.io/';
    }

    if (Math.random() < .6) {
        // Africa and Arab Contests
        // https://icpcarchive.github.io/Arab_Collegiate_Programming_Championship.html
        // Only Arab 2018 is present.

        console.log('Todo: choices to be expanded for Africa and Arab Contests');
        return 'https://icpcarchive.github.io/Arab_Collegiate_Programming_Championship.html'
    }

    // Latin America
    // https://icpcarchive.github.io/Latin_American_Regional_Contest.html
    const years = new Set([...range(2012, ICPC_LATEST_YEAR + 1)]);
    years.delete(2014);
    years.delete(2018);
    years.delete(2019);
    years.delete(2021);

    const year = pickRandomItem([...years]);

    if (year === 2020) {
        return `file://${__dirname}/icpc/larc-2020/problems.pdf`;
    }

    console.log(`Todo: choices to be expanded for LARC, year ${year}`);

    return 'https://icpcarchive.github.io/Latin_American_Regional_Contest.html';
}

function pickRandomLanguage(source) {
    if (Math.random() < .75) {
        if (Math.random() < .5) return 'Python';
        return 'C#';
    }
    if (Math.random() < .6) return 'C++';
    if (Math.random() < .6) return 'C';
    return 'JavaScript';
}

function pickRandomProblem(source) {
    if (source.includes('http://acm.ro/2019'))
        return pickRandomItem('ABCDEFGHIJK');
    
    if (source.includes('icpc/ayrc-2019'))
        return pickRandomItem('ABCDEFGHIJKLMN');

    if (source.includes('icpc/larc-2020'))
        return pickRandomItem('ABCDEFGHIJKLMN');
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
