function pickRandomSource() {

    // Use the Korean online judge.

    if (Math.random < .6) {
        return `https://www.acmicpc.net/problem/random/all`;
    }

    // HackerRank

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
}

function pickRandomLanguage() {
    if (Math.random() < .6) return 'C++';
    if (Math.random() < .6) return 'C#';
    if (Math.random() < .6) return 'Python';
    if (Math.random() < .6) return 'C';
    if (Math.random() < .6) return 'Scala';
    if (Math.random() < .6) return 'Java';
    if (Math.random() < .6) return 'Rust';
    if (Math.random() < .6) return 'Go';
    return 'JavaScript';
}

function pickRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}

const args = process.argv.slice(2);
const noArgs = args.length === 0;
const askingSource = noArgs || args.includes("source");
const askingLanguage = noArgs || args.includes("language");

if (askingSource)
    console.log(`Source: ${pickRandomSource()}`);

if (askingLanguage)
    console.log(`Language: ${pickRandomLanguage()}`);
