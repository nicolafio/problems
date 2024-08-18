const { resolve, parse } = require('path');
const { readdirSync, readFileSync } = require('fs');
const { spawnSync, execSync } = require('child_process');

// TODO: programmatically infer the tier.
const BAEKJOON_MID_TIER = 1;
const BAEKJOON_MAX_TIER = 30;

main();

function main() {
    const problems = [...getBaekjoonProblems()];

    console.log(JSON.stringify(problems, null, 4));

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

const FOLDERS_NOT_CONTAINING_BAEKJOON_PROBLEMS =
    new Set(['.git', 'assets', 'hackerrank', 'leetcode']);

function* getBaekjoonProblems(dir = __dirname) {
    // https://stackoverflow.com/a/45130990
    
    const nodes = readdirSync(dir, { withFileTypes: true });

    for (const node of nodes) {
        if (FOLDERS_NOT_CONTAINING_BAEKJOON_PROBLEMS.has(node.name)) continue;
        
        const path = resolve(dir, node.name);
        
        if (isIgnoredByGit(path)) continue;

        if (node.isDirectory()) {
            yield* getBaekjoonProblems(path);
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

        yield {title, tier, number, dir, url};
    }
}

function* getBaekjoonProblemTimes(problemDir) {
    for (const solution of getBaekjoonProblemSolutionFiles(problemDir)) {
        const path = solution.path;
        const gitArgs = ['log', '--follow', '--pretty=format:%ad%n%s', path];
        const result = spawnSync('git', gitArgs, { encoding: 'utf-8' });

        if (result.status !== 0) console.error(result.stderr);

        const log = result.stdout.split('\n');
        let solveDate = null;
        let fetchDate = null;

        for (let i = 0; i < log.length; i += 2) {
            const date = new Date(log[i]);
            const subject = log[i + 1];
    
            if (fetchDate === null) fetchDate = date;
    
            if (solveDate === null && /^\s*solve\s*$/i.test(subject)) {
                solveDate 
            }
            
        }
    }
}

function* getBaekjoonProblemSolutionFiles(problemDir) {
    const nodes = readdirSync(problemDir, { withFileTypes: true });

    for (const node of nodes) {
        const path = resolve(problemDir, node.name);

        if (!node.isFile()) continue;
        if (isIgnoredByGit(path)) continue;

        const { base, name, ext } = parse(path);

        if (base.toLowerCase() !== 'solve') continue;

        yield { path, base, name, ext };
    }
}

const isIgnoredByGit = (function () {
    const memo = new Map();

    return function isIgnoredByGit(path) {
        if (memo.has(path)) return memo.get(path);

        // https://git-scm.com/docs/git-check-ignore

        const args = ['check-ignore', '--quiet', '--stdin'];
        const result = spawnSync('git', args, { cwd: path, input: path });

        return result.status === 0;
    };
})();
