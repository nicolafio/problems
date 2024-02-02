const SOURCES = {
    HR_3MOPK: 'https://www.hackerrank.com/interview/preparation-kits/three-month-preparation-kit/',
    HR_ALGOS_EASY: 'https://www.hackerrank.com/domains/algorithms?filters%5Bdifficulty%5D%5B%5D=easy',
    HR_ALGOS_MEDIUM: 'https://www.hackerrank.com/domains/algorithms?filters%5Bdifficulty%5D%5B%5D=medium',
    HR_ALGOS_HARD: 'https://www.hackerrank.com/domains/algorithms?filters%5Bdifficulty%5D%5B%5D=HARD',
    HR_DS_EASY: 'https://www.hackerrank.com/domains/data-structures?filters%5Bdifficulty%5D%5B%5D=easy',
    HR_DS_MEDIUM: 'https://www.hackerrank.com/domains/data-structures?filters%5Bdifficulty%5D%5B%5D=medium',
    HR_DS_HARD: 'https://www.hackerrank.com/domains/data-structures?filters%5Bdifficulty%5D%5B%5D=hard',
    ICPC: 'https://icpc.global/worldfinals/past-problems',
}

const DIFFICULTY = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard'
};

function pickRandomSource() {
    if (Math.random() < .8) {
        if (Math.random() < .8) return SOURCES.HR_3MOPK;
        const difficulty = pickRandomDifficulty();
        if (Math.random < .8) {
            if (difficulty === DIFFICULTY.EASY) return SOURCES.HR_ALGOS_EASY;
            if (difficulty === DIFFICULTY.MEDIUM) return SOURCES.HR_ALGOS_MEDIUM;
            if (difficulty === DIFFICULTY.HARD) return SOURCES.HR_ALGOS_HARD;
        }
        if (difficulty === DIFFICULTY.EASY) return SOURCES.HR_DS_EASY;
        if (difficulty === DIFFICULTY.MEDIUM) return SOURCES.HR_DS_MEDIUM;
        if (difficulty === DIFFICULTY.HARD) return SOURCES.HR_DS_HARD;
        return SOURCES.HR_DS;
    };
    return SOURCES.ICPC;
}

function pickRandomLanguage(source) {
    if (Math.random() < .6 && source != SOURCES.ICPC) return 'C#';
    if (Math.random() < .6) return 'C++';
    if (Math.random() < .6) return 'C';
    if (Math.random() < .6 && source != SOURCES.ICPC) return 'JavaScript';
    return 'Python';
}

function pickRandomDifficulty() {
    if (Math.random() < .4) return DIFFICULTY.EASY;
    if (Math.random() < .6) return DIFFICULTY.MEDIUM;
    return DIFFICULTY.HARD;
}

const source = pickRandomSource();
const language = pickRandomLanguage(source);

console.log(`Source: ${source}`);
console.log(`Language: ${language}`);

