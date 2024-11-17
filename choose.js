const { resolve, parse, dirname } = require('path');
const { readdirSync, readFileSync, stat } = require('fs');
const { spawnSync } = require('child_process');

const FOLDERS_NOT_CONTAINING_PROBLEM_ATTEMPTS =
    new Set(['.git', 'assets', 'hackerrank']);

const LEETCODE_PROBLEMS =
    JSON.parse(readFileSync(`${__dirname}/assets/24q4/leetcode-problems.json`, 'utf8'));

const LEETCODE_PROBLEMS_MIN_RATING =
    Math.min(...Object.values(LEETCODE_PROBLEMS).map(p => p.rating));

const LEETCODE_PROBLEMS_MAX_RATING =
    Math.max(...Object.values(LEETCODE_PROBLEMS).map(p => p.rating));

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

const PLATFORMS = new Set([
    'baekjoon',
    'leetcode'
]);

const LANGUAGES = new Set(LANGUAGE_BY_EXTENSION.values());
const MAX_TIER = 30;
const ATTEMTPS_TO_TIER_MASTERY = 4;
const BASE_MINUTES_PER_ATTEMPT_FOR_MASTERY = 30;
const EXTRA_MINUTES_PER_TIER_FOR_MASTERY = 3;

function main() {
    const requestedLanguage = argsInclude('l', 'lang', 'language');
    const requestedSource = argsInclude('s', 'src', 'source');
    const requestedPlatform = argsInclude('p', 'pla', 'platform')
    const printLanguage = requestedLanguage || (!requestedSource && !requestedPlatform);
    const printSource = requestedSource || (!requestedLanguage && !requestedPlatform);
    const printPlatform = requestedPlatform || (!requestedLanguage && !requestedPlatform);

    if (argsInclude('info')) {
        console.log(
            JSON.stringify(Object.fromEntries([...PLATFORMS].map((p) => ({
                languages: midTierByLanguage(p),
                tiers: [...tiers(p)].filter(({attempts}) => attempts.length > 0)
            }))), null, 4)
        );
        return;
    }

    let language = null;
    let platform = null;

    for (const [e, l] of LANGUAGE_BY_EXTENSION) {
        if (argsInclude(e, e.substring(1), l, l.toLowerCase())) {
            language = l;
            break;
        }
    }

    for (const p of PLATFORMS) {
        if (argsInclude(p)) {
            platform = p;
        }
    }

    if (!language) {
        language = pickRandomLanguage();
    }

    if (!platform) {
        platform = pickRandomPlatform();
    }

    if (printSource)
        console.log(`Source: ${pickRandomSource(platform, language)}`);

    if (printLanguage)
        console.log(`Language: ${language}`);

    if (printPlatform)
        console.log(`Platform: ${platform}`)

    printLevelProgress(platform, language).catch(console.error);
}

function printTierProgress(platform, language, timeCutoff) {
    const {tier, solvedWithinLimit} = midTier(platform, language, timeCutoff);

    console.log('★'.repeat(tier));

    let checkBoxes = '';

    for (let i = 0; i < ATTEMTPS_TO_TIER_MASTERY; i++) {
        if (i < solvedWithinLimit) checkBoxes += '● ';
        else checkBoxes += '○ ';
    }

    console.log(`For ${platform} ${language} you are at tier ${tier}`)

}

async function printLevelProgress(platform, language) {
    const solved = [...problemAttempts()]
        .filter(a => a.solveDate)
        .sort((a, b) => a.solveDate - b.solveDate);

    const baseSolutionExp = 100;

    const nextTierExp = (previousTierExp) => Math.ceil(previousTierExp * 1.2);

    const expByTier = new Map();

    expByTier.set(1, baseSolutionExp);

    for (let i = 2; i <= MAX_TIER; i++) {
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

        const { tier } = midTier(platform, attempt.language, attempt.solveDate);

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
    printTierProgress(platform, language, Date.now());

    if (language !== attempt.language)
        printTierProgress(platform, attempt.language, attempt.solveDate);

    process.stdout.write(`You solved: ${String(solvedCount)} problems\n`);
    process.stdout.write(`Last attempt: \n`);
    process.stdout.write(`${'Platform'.padStart(10, ' ')}: ${attempt.platform}\n`)
    process.stdout.write(`${'Title'.padStart(10, ' ')}: ${attempt.title}\n`)
    process.stdout.write(`${'Language'.padStart(10, ' ')}: ${attempt.language}\n`)
    process.stdout.write(`${'Tier'.padStart(10, ' ')}: ${attempt.tier}\n`);
    process.stdout.write(`${'Time'.padStart(10, ' ')}: ${attempt.timeTakenToSolveMinutes} minutes\n`);
    process.stdout.write(`${'Location'.padStart(10, ' ')}: ${attempt.path}\n`);
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

function pickRandomSource(platform, language) {
    let difficulty = 'edge';

    if (argsInclude('easy', 'e'))
        difficulty = 'easy;'

    if (argsInclude('medium', 'm'))
        difficulty = 'medium';

    if (argsInclude('edge', 'e'))
        difficulty = 'edge';

    if (argsInclude('hard', 'h'))
        difficulty = 'hard';

    const tier = pickRandomTier(difficulty, platform, language);

    // Use LeetCode
    if (platform === 'leetcode') {
        const problems =
            Object.values(LEETCODE_PROBLEMS)
                .filter(p => convertLeetcodeRatingToTier(p.rating) === tier)
        const random = Math.random();
        const maxIndex = problems.length - 1;
        const index = Math.min(maxIndex, Math.floor(random * problems.length));
        const problem = problems[index];
        return problem.problem_URL;
    }

    // Use the Korean online judge.
    if (platform === 'baekjoon') {
        return (
            'https://www.acmicpc.net/problemset' +
            '?sort=random_asc' +
            '&submit=pac%2Cfa%2Cus' +
            `&tier=${tier}` +
            '&lucky=1' +
            '&english=1'
        );
    }
}

function pickRandomTier(difficulty, platform, language) {
    const ranges = {};
    const mid = midTier(platform, language).tier;

    ranges.easy = {
        min: 1,
        max: Math.max(mid - 1, 1)
    };

    ranges.medium = {
        min: mid,
        max: Math.min(mid + 2, MAX_TIER)
    };

    ranges.edge = {
        min: Math.min(ranges.medium.max + 1, MAX_TIER),
        max: Math.min(ranges.medium.max + 3, MAX_TIER)
    };

    ranges.hard = {
        min: Math.min(ranges.edge.max + 1, MAX_TIER),
        max: MAX_TIER
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

function pickRandomPlatform() {
    for (const platform of PLATFORMS)
        if (argsInclude(platform))
            return platform;
    if (Math.random() < .5) return 'baekjoon';
    return 'leetcode';
}

const midTier = function (platform, language, timeCutoff = new Date()) {
    return midTierByLanguage(platform, timeCutoff)[language];
}

const midTierByLanguage = memoized(function(platform, timeCutoff = new Date()) {
    const result = {};

    for (const language of LANGUAGES) {
        let mid = 1;
        for (const tier of tiers(platform, timeCutoff)) {
            if (tier.language === language && tier.mastered) {
                mid = Math.max(tier.tier + 1, mid);
            }
        }
        for (const tier of tiers(platform, timeCutoff)) {
            if (tier.language === language && tier.tier === mid) {
                result[language] = tier;
            }
        }
    }

    return result;
});

const tiers = memoizedGenerator(function* (platform, timeCutoff = new Date()) {
    const allAttempts = [...problemAttempts()]
        .filter(a => (a.solveDate || a.fetchDate) <= timeCutoff)
        .filter(a => a.platform === platform)
        .sort((a, b) => b.fetchDate - a.fetchDate);

    for (const language of LANGUAGES) {
        const attemptsWithLanguage = allAttempts.filter(a => a.language === language);

        for (let tier = MAX_TIER, mastered = false; tier >= 1; tier--) {
            const attempts = attemptsWithLanguage.filter(a => a.tier === tier);
            let progress = 0;
            let solvedWithinLimit = 0;

            for (const mode of ['same-tier', 'same-tier-or-above']) {
                let count = 0, total = 0;
                for (const attempt of attemptsWithLanguage) {
                    if (mode === 'same-tier' && attempt.tier !== tier) continue;
                    if (mode === 'same-tier-or-above' && attempt.tier < tier) continue;

                    total++;

                    if (total > ATTEMTPS_TO_TIER_MASTERY) break;
                    if (attempt.solvedWithinLimit) count++;
                }
                if (count > solvedWithinLimit) {
                    solvedWithinLimit = count;
                }
            }

            if (!mastered) {
                progress = solvedWithinLimit / ATTEMTPS_TO_TIER_MASTERY;

                if (solvedWithinLimit >= ATTEMTPS_TO_TIER_MASTERY) {
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

const problemAttempts = lazyGenerator(function* () {
    const attemptsYieled = new Set();
    yield* (function* gen(dir = __dirname) {
        const folderPaths =
            readdirSync(dir, { withFileTypes: true })
                .filter(n => n.isDirectory())
                .map(n => n.name)
                .filter(n => !FOLDERS_NOT_CONTAINING_PROBLEM_ATTEMPTS.has(n))
                .map(n => `${dir}/${n}`)
                .filter(p => !ignoredByGit(p));

        for (const path of folderPaths) {
            yield* gen(path);
            const leetCodeAttemptsScout = scoutForLeetCodeProblemAttempts(path);
            const baekjoonAttemptsScout = scoutForBaekjoonProblemAttempts(path);
            for (const attempt of joinIterables(leetCodeAttemptsScout, baekjoonAttemptsScout)) {
                if (attemptsYieled.has(attempt.path)) continue;
                attemptsYieled.add(attempt.path);
                yield attempt;
            }
        }
    })();
});

function* scoutForLeetCodeProblemAttempts(dir) {
    if (!dir.startsWith(`${__dirname}/leetcode/`)) return;

    const dirName = dirname(dir);
    if (!(dirName in LEETCODE_PROBLEMS)) return;

    const title = LEETCODE_PROBLEMS[dirName].title;
    const number = LEETCODE_PROBLEMS[dirName].id;
    const rating = LEETCODE_PROBLEMS[dirName].rating;
    const tier = convertLeetcodeRatingToTier(rating);
    const platform = 'leetcode';

    const problem = { platform, title, number, rating, tier };

    for (const attempt of attempts(dir, tier)) {
        yield {...problem, ...attempt};
    }
}

function* scoutForBaekjoonProblemAttempts(dir) {
    const nodes = [...readdirSync(dir, { withFileTypes: true })];
    const files = nodes.filter(n => n.isFile());
    const readmeFile = files.find(f => f.name.toLowerCase() === 'readme.md');
    if (!readmeFile) return;
    const readmePath = `${dir}/${readmeFile.name}`;
    const markdown = readFileSync(readmePath, {encoding: 'utf-8'});
    let problem = parseBaekjoonProblemDetailsFromReadme(markdown);
    if (!problem) return;
    const platform = 'baekjoon';
    problem = {...problem, dir, platform};
    for (const attempt of attempts(dir, problem.tier)) {
        yield {...problem, ...attempt};
    }
}


function convertLeetcodeRatingToTier(rating) {
    const minRating = LEETCODE_PROBLEMS_MIN_RATING;
    const maxRating = LEETCODE_PROBLEMS_MAX_RATING;
    const minTier = 1;
    const maxTier = MAX_TIER;
    const ratingRange = maxRating - minRating;
    const tierRange = maxTier - minTier;
    const unitValue = (rating - minRating) / ratingRange;
    return minTier + Math.floor(unitValue * tierRange);
}

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

const attempts = memoizedGenerator(function* (problemDir, problemTier) {
    const nodes = readdirSync(problemDir, { withFileTypes: true });

    let minutesForMastery = BASE_MINUTES_PER_ATTEMPT_FOR_MASTERY;
    if (problemTier > 1) {
        const extraMinutes = (problemTier - 1) * EXTRA_MINUTES_PER_TIER_FOR_MASTERY
        minutesForMastery += extraMinutes;
    }

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
        let solvedWithinLimit = false;
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
            solvedWithinLimit = timeTakenToSolveMinutes <= minutesForMastery;
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

// ---- GIT UTILS ----

const creationTime = memoized(function (path) {
    let result = null;
    for (const { date } of gitLogFollow(path)) {
        if (result === null) result = date;
        if (date < result) result = date;
    }
    return result;
});

const gitLogFollow = memoizedGenerator(function* (path) {
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

const ignoredByGit = memoized(function(path) {
    // https://git-scm.com/docs/git-check-ignore

    const { status } = git('check-ignore', '--quiet', path);

    return status === 0;
});

function git(...args) {
    return spawnSync('git', args, { cwd: __dirname, encoding: 'utf-8' });
}

// ---- ALGO / DATA STRUCTURE UTILS ----

function lazyGenerator(gen) {
    // Using linked list approach to memorize generated values.
    // Will invoke generator `gen` to retrieve next value if not memorized yet.
    // Will return a generator function that yields all generated values from the start and invokes `gen` to generate
    // the next value.
    // This function is limited by the available space in the heap. It will generate new values on-demand.
    // Will throw error as thrown by original generator.
    let first;
    let returned;
    let error;
    let errored = false;
    let done = false;

    return function* () {
        if (done) {
            for (let current = first; current; current = current.next)
                yield current.value;
            if (errored)
                throw error;
            return returned;
        }
        const generator = gen();
        for (let current = first, prev = null; true; prev = current, current = current.next) {
            if (current) {
                yield current.value;
                continue;
            }
            let next;
            try {
                next = generator.next();
            }
            catch (e) {
                done = true;
                errored = true;
                error = e;
                throw error;
            }
            if (next.done) {
                done = true;
                returned = next.value;
                return returned;
            }
            current = { value: next.value };
            if (prev) prev.next = current;
            if (!first) first = current;
            yield current.value;
        }
    }
}

function memoizedGenerator(gen) {
    // Like lazyGenerator, but accepts parameters and saves generated values for every
    // combination of arguments (like Python's functools.cached).
    //
    // Makes use of weak allocation when possible, so that when arguments
    // get garbage collected, so can the memorized values.

    const getLazyGenerator = memoized(function (...args) {
        return lazyGenerator(function* () {
            yield* gen(...args);
        });
    });

    return function* (...args) {
        const lazyGen = getLazyGenerator(...args)
        yield* lazyGen();
    }
}

function memoized(fn) {
    // Memoization like Python's functools.cached functions.
    //
    // Makes use of weak allocation when possible, so that when arguments
    // get garbage collected, so can the memorized values.
    //
    const memo = {
        functions: {
            strong: new Map(),
            weak: new WeakMap()
        },
        values: {
            strong: new Map(),
            weak: new WeakMap()
        }
    };

    return function (arg, ...rest) {
        if (rest.length === 0) {
            for (const strength of ['strong', 'weak'])
                if (memo.values[strength].has(arg))
                    return memo.values[strength].get(arg);
            const result = fn(arg);
            try {
                memo.values.weak.set(arg, result);
            }
            catch (_) {
                memo.values.strong.set(arg, result);
            }
            return result;
        }
        for (const strength of ['strong', 'weak'])
            if (memo.functions[strength].has(arg))
                return memo.functions[strength].get(arg)(...rest);
        const subFn = makeSub(arg);
        try {
            memo.functions.weak.set(arg, subFn);
        }
        catch (_) {
            memo.functions.strong.set(arg, subFn);
        }
        return subFn(...rest);
    }
    function makeSub(arg) {
        return memoized(function(...args) {
            return fn(arg, ...args);
        });
    }
}

function* joinIterables(...iterables) {
    for (const iterable of iterables) {
        yield* iterable;
    }
}

main();