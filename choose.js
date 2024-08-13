// TODO: programmatically infer the tier.
const BAEKJOON_MID_TIER = 1;
const BAEKJOON_MAX_TIER = 30;

main();

function main() {
    let noArgs = process.argv.length == 2;

    if (noArgs || argsInclude("source", "src", "s"))
        console.log(`Source: ${pickRandomSource()}`);

    if (noArgs || argsInclude("language", "lang", "l"))
        console.log(`Language: ${pickRandomLanguage()}`);
}

function argsInclude(...items) {
    for (const item of items) {
        for (let i = 2; i < process.argv.length; i++) {
            if (item == process.argv[i]) {
                return true;
            }
        }
    }
    return false;
}

function pickRandomSource() {
    let difficulty = 'medium';

    if (argsInclude('easy', 'e'))
        difficulty = 'easy;'

    if (argsInclude('medium', 'm'))
        difficulty = 'medium';

    if (argsInclude('hard', 'h'))
        difficulty = 'hard';

    // Use the Korean online judge.

    return (
        'https://www.acmicpc.net/problemset' +
        '?sort=random_asc' +
        '&submit=pac%2Cfa%2Cus' +
        `&tier=${pickRandomTierInBaekjoon(difficulty)}` +
        '&lucky=1'
    );
}

function pickRandomTierInBaekjoon(difficulty) {
    const ranges = {};

    ranges.easy = {
        min: 1,
        max: Math.max(BAEKJOON_MID_TIER - 1, 1)
    };

    ranges.medium = {
        min: BAEKJOON_MID_TIER,
        max: Math.min(BAEKJOON_MID_TIER + 1, BAEKJOON_MAX_TIER)
    };

    ranges.hard = {
        min: Math.min(ranges.medium.max + 1, BAEKJOON_MAX_TIER),
        max: BAEKJOON_MAX_TIER
    };

    const {min, max} = ranges[difficulty];

    return min + Math.floor(Math.random() * (max - min + 1));
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
    if (Math.random() < .6) return 'TypeScript';
    return 'JavaScript';
}

function pickRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
}
