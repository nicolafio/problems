const { spawn, spawnSync } = require('child_process');
const { basename, extname } = require('path');
const { readdirSync, readFileSync } = require('fs');
const { Readable } = require('stream');

const DOCKERFILE = `${__dirname}/build.Dockerfile`;

main().catch(console.error);

async function main() {
    const problem = basename(__dirname);
    const tag = `${problem}-build`;

    if (build(tag).status === 0)
        await run(tag);
}

function build(tag) {
    const cmd = 'docker';
    const args = [
        'build',
        '--tag', tag,
        '--file', DOCKERFILE,
        '--no-cache-filter', 'build',
        '.'
    ];

    return spawnSync(cmd, args, { stdio: 'inherit' });
}

async function run(tag) {
    const inputDir = `${__dirname}/input`;

    console.log(inputDir);
    let dirEntries = null;

    try { dirEntries = readdirSync(inputDir) }
    catch (_) {}

    if (dirEntries === null || argsInclude('i', 'interact')) {
        console.log('Running interactively');

        const cmd = 'docker';
        const args = ['run', '-it', tag, '/work/solution'];
        return spawnSync(cmd, args, { stdio: 'inherit' });
    }

    for (const entry of dirEntries) {
        if (extname(entry) != '.txt') continue;

        const path = `${inputDir}/${entry}`;
        const txt = readFileSync(path, 'utf-8');

        console.log(`-------${'-'.repeat(entry.length)}-`);
        console.log(`INPUT (${entry})`);
        console.log(`-------${'-'.repeat(entry.length)}-`);
        console.log(txt);

        console.log('------');
        console.log('OUTPUT');
        console.log('------');

        const cmd = 'docker';
        const args = ['run', '-i', tag, '/work/solution'];
        const child = spawn(cmd, args, {
            stdio: ['pipe', 'inherit', 'inherit'],
        });

        child.stdin.write(txt);

        await new Promise((resolve) => {
            child.on('exit', () => {
                resolve();
            })
        });
    }
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
