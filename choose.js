const { resolve, parse } = require('path');
const { readdirSync, readFileSync, stat } = require('fs');
const { spawnSync } = require('child_process');

const FOLDERS_NOT_CONTAINING_BAEKJOON_PROBLEMS =
    new Set(['.git', 'assets', 'hackerrank', 'leetcode']);

const LANGUAGE_BY_EXTENSION = new Map([
    ['.c', 'C'],
    ['.cs', 'C#'],
    ['.cc', 'C++'],
    ['.cpp', 'C++'],
    ['.js', 'JavaScript'],
    ['.jsm', 'JavaScript'],
    ['.ts', 'TypeScript'],
    ['.py', 'Python'],
    ['.go', 'Go'],
    ['.rs', 'Rust'],
    ['.java', 'Java'],
    ['.scala', 'Scala'],
]);

// TODO: programmatically infer the tier.
const BAEKJOON_MID_TIER = 1;
const BAEKJOON_MAX_TIER = 30;

function main() {
    const attempts = [...baekjoonProblemAttempts()];

    console.log(JSON.stringify(attempts, null, 4));

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

function* baekjoonProblemAttempts(dir = __dirname) {
    // https://stackoverflow.com/a/45130990
    
    const nodes = readdirSync(dir, { withFileTypes: true });

    for (const node of nodes) {
        if (FOLDERS_NOT_CONTAINING_BAEKJOON_PROBLEMS.has(node.name)) continue;
        
        const path = resolve(dir, node.name);
        
        if (ignoredByGit(path)) continue;

        if (node.isDirectory()) {
            yield* baekjoonProblemAttempts(path);
            continue;
        }

        if (!node.isFile()) continue;
        if (node.name.toLowerCase() !== 'readme.md') continue;

        const markdown = readFileSync(path, { encoding: 'utf-8' });

        const match = markdown.match(/\#\s+\!\[[^\]]*\]\(.*\/tier\/([0-9]+)\.svg\)\s+\[([^\]]+)\]\(https:\/\/www\.acmicpc\.net\/problem\/([0-9]+)/)
        
        if (!match) continue;

        const tier = Number(match[1]);
        const title = match[2];
        const number = Number(match[3]);
        const url = `https://www.acmicpc.net/problem/${number}`;

        for (const attempt of attempts(dir)) {
            yield { ...attempt, title, tier, number, dir, url };
        }
    }
}

const attempts = memoizedUnaryGenerator(function* (problemDir) {
    const nodes = readdirSync(problemDir, { withFileTypes: true });

    for (const node of nodes) {
        const path = resolve(problemDir, node.name);

        if (!node.isFile()) continue;
        if (ignoredByGit(path)) continue;

        const { name, ext } = parse(path);

        if (name.toLowerCase() !== 'solution') continue;

        const language = LANGUAGE_BY_EXTENSION.get(ext);

        if (!language) continue;
        
        let solveDate = null;
        let timeTakenToSolveMinutes = null;
        let fetchDate = creationTime(path);

        for (const {date, subject} of gitLogFollow(path)) {
            if (solveDate === null && /^\s*solve\s*$/i.test(subject)) {
                solveDate = date;
            }
        }

        if (fetchDate === solveDate) {
            fetchDate = creationTime(problemDir);
        }

        if (solveDate != null) {
            const timeTakenToSolveMilliseconds = solveDate - fetchDate;
            timeTakenToSolveMinutes = Math.ceil(timeTakenToSolveMilliseconds / 1000 / 60);
        }

        yield {path, language, fetchDate, solveDate, timeTakenToSolveMinutes};
    }
});

const creationTime = memoizedUnary(function (path) {
    let result = null;
    for (const { date } of gitLogFollow(path)) {
        if (result === null) result = date;
        if (date < result) result = date;
    }
    return result;
});


const gitLogFollow = memoizedUnaryGenerator(function* (path) {
    const { stderr, stdout, status } = git('log', '--follow', '--pretty=format:%ad%n%s', path);

    if (status !== 0) {
        console.error(stderr);
        return;
    }

    const lines = stdout.split('\n');

    for (let i = 0; i < lines.length; i += 2) {
        const date = new Date(lines[i]);
        const subject = lines[i + 1];

        yield { date, subject };
    }
});

const ignoredByGit = memoizedUnary(function(path) {
    // https://git-scm.com/docs/git-check-ignore

    const { status } = git('check-ignore', '--quiet', path);

    return status === 0;
});

function git(...args) {
    return spawnSync('git', args, { cwd: __dirname, encoding: 'utf-8' });
}

function memoizedUnaryGenerator(gen) {
    const memo = new Map();
    return function* (arg) {
        if (memo.has(arg)) {
            yield* memo.get(arg);
            return;
        }
        const res = [...gen(arg)];
        memo.set(arg, res);
        yield* res;
    }
}

function memoizedUnary(fn) {
    const memo = new Map();
    return function (arg) {
        if (memo.has(arg)) return memo.get(arg);
        const res = fn(arg);
        memo.set(arg, res);
        return res;
    }
}

main();