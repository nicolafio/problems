const SOURCES = {
    HACKERRANK: 'https://www.hackerrank.com',
    ICPC: 'https://icpc.global/worldfinals/past-problems',
}

function pickRandomSource() {
    if (Math.random() < .8) return SOURCES.HACKERRANK;
    return SOURCES.ICPC;    
}

function pickRandomLanguage(source) {
    if (Math.random() < .6 && source != SOURCES.ICPC) return 'C#';
    if (Math.random() < .6) return 'C++';
    if (Math.random() < .6) return 'C';
    if (Math.random() < .6 && source != SOURCES.ICPC) return 'JavaScript';
    return 'Python';
}

console.log(`Source: ${pickRandomSource()}`);
console.log(`Language: ${pickRandomLanguage()}`);
