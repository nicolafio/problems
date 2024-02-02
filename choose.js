const SOURCES = {
    HR_3MOPK: 'https://www.hackerrank.com/interview/preparation-kits/three-month-preparation-kit/',
    HR_A: 'https://www.hackerrank.com/domains/algorithms',
    HR_DS: 'https://www.hackerrank.com/domains/data-structures',
    ICPC: 'https://icpc.global/worldfinals/past-problems',
}

function pickRandomSource() {
    if (Math.random() < .8) {
        if (Math.random() < .8) return SOURCES.HR_3MOPK;
        if (Math.random < .8) return SOURCES.HR_A;
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
    if (Math.random() < .4) return 'Easy';
    if (Math.random() < .6) return 'Medium';
    return 'Hard';
}

const source = pickRandomSource();
const language = pickRandomLanguage(source);

console.log(`Source: ${source}`);
console.log(`Language: ${language}`);

if ([SOURCES.HR_A, SOURCES.HR_DS].includes(source)) {
    const difficulty = pickRandomDifficulty();
    console.log(`Difficulty: ${difficulty}`);
}
