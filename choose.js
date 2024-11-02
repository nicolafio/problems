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

const LANGUAGES = new Set(LANGUAGE_BY_EXTENSION.values());
const BAEKJOON_MAX_TIER = 30;
const BAEKJOON_ATTEMPTS_TO_TIER_MASTERY = 1;
const BAEKJOON_BASE_MINUTES_PER_ATTEMPT_FOR_MASTERY = 20;
const BAEKJOON_EXTRA_MINUTES_PER_TIER_FOR_MASTERY = 2;

function main() {
    const requestedLanguage = argsInclude('l', 'lang', 'language');
    const requestedSource = argsInclude('s', 'src', 'source');
    const printLanguage = requestedLanguage || !requestedSource;
    const printSource = requestedSource || !requestedLanguage;

    if (argsInclude('info')) {
        console.log(
            JSON.stringify({
                languages: baekjoonMidTiersByLanguage(),
                tiers: [...baekjoonTiers()].filter(({attempts}) => attempts.length > 0)
            }, null, 4)
        );
        return;
    }

    let language = null;

    for (const [e, l] of LANGUAGE_BY_EXTENSION) {
        if (argsInclude(e, e.substring(1), l, l.toLowerCase())) {
            language = l;
            break;
        }
    }

    if (!language) {
        language = pickRandomLanguage();
    }

    if (printSource)
        console.log(`Source: ${pickRandomSource(language)}`);

    if (printLanguage)
        console.log(`Language: ${language}`);

    printBaekjoonLevelProgress(language).catch(console.error);
}

function printBaekjoonTierProgress(language, timeCutoff) {
    const {tier, solvedWithinLimit} = baekjoonMidTier(language, timeCutoff);

    console.log('★'.repeat(tier));

    let checkBoxes = '';

    for (let i = 0; i < BAEKJOON_ATTEMPTS_TO_TIER_MASTERY; i++) {
        if (i < solvedWithinLimit) checkBoxes += '● ';
        else checkBoxes += '○ ';
    }

    console.log(`For ${language} you are at tier ${tier}`)

}

async function printBaekjoonLevelProgress(language) {
    const solved = [...baekjoonProblemAttempts()]
        .filter(a => a.solveDate)
        .sort((a, b) => a.solveDate - b.solveDate);

    const baseSolutionExp = 100;

    const nextTierExp = (previousTierExp) => Math.ceil(previousTierExp * 1.2);

    const expByTier = new Map();

    expByTier.set(1, baseSolutionExp);

    for (let i = 2; i <= BAEKJOON_MAX_TIER; i++) {
        expByTier.set(i, nextTierExp(expByTier.get(i - 1)));
    }

    const baseLevelExp = baseSolutionExp * 4;
    const nextLevelExp = (previousLevelExp) => Math.ceil(previousLevelExp * 1.2);

    let level = 1;
    let levelExp = baseLevelExp;
    let expToNextLevel = baseLevelExp;
    let solvedCount = 0;
    let attempt;
    let foundAttemptWithoutTierClassification = false;

    for (attempt of solved) {
        solvedCount++;

        const {tier} = baekjoonMidTier(attempt.language, attempt.solveDate);

        if (attempt.tier === 0 || isNaN(attempt.tier)) {
            if (!foundAttemptWithoutTierClassification) {
                console.log();
                console.log('No tier classification for:');
                foundAttemptWithoutTierClassification = true;
            }
            console.log(`* ${attempt.title} - ${attempt.path}`);
            continue;
        }

        const tierDelta = attempt.tier - tier;

        let exp = Math.floor(
            expByTier.get(attempt.tier) *
            (tierDelta < 0 ? (1.20 ** tierDelta) : 1) *
            (1.10 ** (tier - 1))
        );

        expToNextLevel -= exp;

        while (expToNextLevel < 0) {
            level++;
            levelExp = nextLevelExp(levelExp);
            expToNextLevel += levelExp;
        }
    }

    if (foundAttemptWithoutTierClassification) {
        console.log();
    }

    const progress = (levelExp - expToNextLevel) / levelExp;
    printProgressASCIIArt(progress, `Lv.${level}`);
    printBaekjoonTierProgress(language, Date.now());
    printBaekjoonTierProgress(attempt.language, attempt.solveDate);
    process.stdout.write(`You solved: ${String(solvedCount)} problems\n`);
    process.stdout.write(`Last attempt: ${attempt.title}\n`);
    process.stdout.write(`Last attempt language: ${attempt.language}\n`);
    process.stdout.write(`Last attempt tier: ${attempt.tier}\n`);
}

function printProgressASCIIArt(progress, label) {
    const length = 80;
    const brackets = ['[ ', ' ]'];
    const innerBoxLength = length - brackets[0].length - brackets[1].length;
    const innerBoxPosition = brackets[0].length;

    const progressDigits = String(Math.round(progress * 10000));

    const progressUnits =
        progressDigits
            .substr(0, progressDigits.length - 2)
            .padStart(1, '0');

    const progressDecimals =
        progressDigits
            .substr(-2)
            .padStart(2, '0');

    label = ` ${label} ${progressUnits}.${progressDecimals}% `;

    const labelPositition =
        innerBoxPosition +
        Math.floor(innerBoxLength / 2 - label.length / 2);

    let art = '';

    art += brackets[0];

    while (art.length < innerBoxPosition + innerBoxLength) {
        if (art.length === labelPositition) {
            art += label;
            continue;
        }

        if (progress === 0) {
            art += ' ';
            continue;
        }

        const i = art.length - innerBoxPosition;
        const p = i / innerBoxLength;

        art += (p <= progress ? '=' : ' ');
    }

    art += brackets[1];

    console.log(art);
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

function pickRandomSource(language) {
    let difficulty = 'edge';

    if (argsInclude('easy', 'e'))
        difficulty = 'easy;'

    if (argsInclude('medium', 'm'))
        difficulty = 'medium';

    if (argsInclude('edge', 'e'))
        difficulty = 'edge';

    if (argsInclude('hard', 'h'))
        difficulty = 'hard';

    // Use the Korean online judge.

    return (
        'https://www.acmicpc.net/problemset' +
        '?sort=random_asc' +
        '&submit=pac%2Cfa%2Cus' +
        `&tier=${pickRandomTierInBaekjoon(difficulty, language)}` +
        '&lucky=1' +
        '&english=1'
    );
}

function pickRandomTierInBaekjoon(difficulty, language) {
    const ranges = {};
    const midTier = baekjoonMidTier(language).tier;

    ranges.easy = {
        min: 1,
        max: Math.max(midTier - 1, 1)
    };

    ranges.medium = {
        min: midTier,
        max: Math.min(midTier + 2, BAEKJOON_MAX_TIER)
    };

    ranges.edge = {
        min: Math.min(ranges.medium.max + 1, BAEKJOON_MAX_TIER),
        max: Math.min(ranges.medium.max + 3, BAEKJOON_MAX_TIER)
    };

    ranges.hard = {
        min: Math.min(ranges.edge.max + 1, BAEKJOON_MAX_TIER),
        max: BAEKJOON_MAX_TIER
    };

    const {min, max} = ranges[difficulty];

    return min + Math.floor(Math.random() * (max - min + 1));
}

function pickRandomLanguage() {
    if (Math.random() < .4) return 'C';
    if (Math.random() < .6) return 'C++';
    if (Math.random() < .6) return 'Python';
    if (Math.random() < .6) return 'Rust';
    if (Math.random() < .6) return 'C#';
    if (Math.random() < .6) return 'Java';
    if (Math.random() < .6) return 'Go';
    if (Math.random() < .6) return 'TypeScript';
    return 'JavaScript';
}

const baekjoonMidTier = function (language, timeCutoff = new Date()) {
    return baekjoonMidTiersByLanguage(timeCutoff)[language];
}

const baekjoonMidTiersByLanguage = memoizedUnary(function(timeCutoff = new Date()) {
    const result = {};

    for (const language of LANGUAGES) {
        let mid = 1;
        for (const tier of baekjoonTiers(timeCutoff)) {
            if (tier.language === language && tier.mastered) {
                mid = Math.max(tier.tier + 1, mid);
            }
        }
        for (const tier of baekjoonTiers(timeCutoff)) {
            if (tier.language === language && tier.tier == mid) {
                result[language] = tier;
            }
        }
    }

    return result;
});


const baekjoonTiers = memoizedUnaryGenerator(function* (timeCutoff = new Date()) {
    const allAttempts = [...baekjoonProblemAttempts()]
        .filter(a => (a.solveDate || a.fetchDate) <= timeCutoff)
        .sort((a, b) => b.fetchDate - a.fetchDate);

    for (const language of LANGUAGES) {
        const attemptsWithLanguage = allAttempts.filter(a => a.language === language);

        for (let tier = BAEKJOON_MAX_TIER, mastered = false; tier >= 1; tier--) {
            const attempts = attemptsWithLanguage.filter(a => a.tier == tier);
            let progress = 0;
            let solvedWithinLimit = 0;

            for (const mode of ['same-tier', 'same-tier-or-above']) {
                let count = 0, total = 0;
                for (const attempt of attemptsWithLanguage) {
                    if (mode == 'same-tier' && attempt.tier !== tier) continue;
                    if (mode == 'same-tier-or-above' && attempt.tier < tier) continue;

                    total++;

                    if (total > BAEKJOON_ATTEMPTS_TO_TIER_MASTERY) break;
                    if (attempt.solvedWithinLimit) count++;
                }
                if (count > solvedWithinLimit) {
                    solvedWithinLimit = count;
                }
            }

            if (!mastered) {
                progress = solvedWithinLimit / BAEKJOON_ATTEMPTS_TO_TIER_MASTERY;

                if (solvedWithinLimit >= BAEKJOON_ATTEMPTS_TO_TIER_MASTERY) {
                    mastered = true;
                }
            }

            if (mastered) {
                progress = 1;
            }

            yield {
                tier,
                language,
                mastered,
                progress,
                solvedWithinLimit,
                attempts
            };
        }
    }
});

const baekjoonProblemAttempts = lazyGenerator(function* () {
    const attemptsYieled = new Set();
    yield* (function* gen(dir = __dirname) {
        const nodes = readdirSync(dir, { withFileTypes: true });

        for (const node of nodes) {
            if (FOLDERS_NOT_CONTAINING_BAEKJOON_PROBLEMS.has(node.name)) continue;

            const path = resolve(dir, node.name);

            if (ignoredByGit(path)) continue;

            if (node.isDirectory()) {
                yield* gen(path);
                continue;
            }

            if (!node.isFile()) continue;
            if (node.name.toLowerCase() !== 'readme.md') continue;

            const markdown = readFileSync(path, { encoding: 'utf-8' });
            let problem = parseBaekjoonProblemDetailsFromReadme(markdown);

            if (!problem) continue;

            problem = {...problem, dir};

            let minutesPerAttemptToMastery =
                BAEKJOON_BASE_MINUTES_PER_ATTEMPT_FOR_MASTERY;

            if (problem.tier > 1) {
                const extraMinutes =
                    (problem.tier - 1) * BAEKJOON_EXTRA_MINUTES_PER_TIER_FOR_MASTERY
                minutesPerAttemptToMastery += extraMinutes;
            }

            for (const attempt of attempts(dir)) {
                if (!attemptsYieled.has(attempt.path)) {
                    attemptsYieled.add(attempt.path);

                    let solvedWithinLimit = false;

                    if (attempt.solveDate != null) {
                        solvedWithinLimit =
                            attempt.timeTakenToSolveMinutes <=
                            minutesPerAttemptToMastery;
                    }

                    yield {
                        ...problem,
                        ...attempt,
                        solvedWithinLimit
                    };
                }
            }
        }
    })();
});


function parseBaekjoonProblemDetailsFromReadme(markdown) {
    const recognizedPatterns = [
        /\#\s+\!\[[^\]]*\]\(.*\/tier\/([0-9]+)\.svg\)\s+\[([^\]]+)\]\(https:\/\/www\.acmicpc\.net\/problem\/([0-9]+)/,
        /\#\s+\[\s*\!\[[^\]]*\]\(.*\/tier\/([0-9]+)\.svg\)\s*\]\(https:\/\/solved\.ac\/contribute\/[0-9]+\)\s+\[([^\]]+)\]\(https:\/\/www\.acmicpc\.net\/problem\/([0-9]+)/,
    ];

    for (const pattern of recognizedPatterns) {
        const match = markdown.match(pattern);

        if (match) {
            const tier = Number(match[1]);
            const title = match[2];
            const number = Number(match[3]);
            const url = `https://www.acmicpc.net/problem/${number}`;

            return {
                tier,
                title,
                number,
                url
            }
        }
    }

    return null;
}

const attempts = memoizedUnaryGenerator(function* (problemDir) {
    const nodes = readdirSync(problemDir, { withFileTypes: true });

    for (const node of nodes) {
        if (!node.isFile()) continue;

        const path = resolve(problemDir, node.name);

        if (ignoredByGit(path)) continue;

        const { name, ext } = parse(path);

        if (name.toLowerCase() !== 'solution') continue;

        const language = LANGUAGE_BY_EXTENSION.get(ext);

        if (!language) continue;

        let solveDate = null;
        let timeTakenToSolveMinutes = null;
        let fetchDate = null;
        const log = [...gitLogFollow(path)];
        let candidateSolution = null;

        for (const entry of log) {
            if (/^\s*solve\s*$/i.test(entry.subject)) {
                candidateSolution = entry;
                break;
            }
        }

        for (const {date, subject} of log) {
            if (subject.toLowerCase() === 'fetch a new problem') {
                fetchDate = date;
                break;
            }
        }

        if (fetchDate === null) {
            fetchDate = creationTime(path);
        }

        if (fetchDate === solveDate) {
            fetchDate = creationTime(problemDir);
        }

        if (candidateSolution != null && fetchDate < candidateSolution.date) {
            solveDate = candidateSolution.date;
        }

        if (solveDate != null) {
            const timeTakenToSolveMilliseconds = solveDate - fetchDate;
            timeTakenToSolveMinutes = Math.ceil(timeTakenToSolveMilliseconds / 1000 / 60);
        }

        yield {
            path,
            language,
            fetchDate,
            solveDate,
            timeTakenToSolveMinutes,
            log
        };
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

function lazyGenerator(gen) {
    let invoked = false;
    let result;
    return function* (...args) {
        if (invoked) {
            yield* result;
            return;
        }
        invoked = true;
        result = [...gen(...args)];
        yield* result;
    }
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