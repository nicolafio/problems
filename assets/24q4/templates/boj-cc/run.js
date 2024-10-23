const { spawn, spawnSync } = require('child_process');
const { basename, extname } = require('path');
const { readdirSync, readFileSync } = require('fs');

const DOCKERFILE = `${__dirname}/build.Dockerfile`;

main().catch(console.error);

async function main() {
    const problem = basename(__dirname);
    const sourcePath = __dirname + '/solution.cc';
    const tag = `${problem}-build`;
    let terminating = false;

    const onTermination = () => { terminating = true };

    process.on('SIGINT', onTermination);
    process.on('SIGTERM', onTermination);

    while (!terminating) {
        const hash = getFileHash(sourcePath);

        if (build(tag).status === 0)
            await run(tag);

        while (!terminating && getFileHash(sourcePath) === hash)
            await wait(15);
    }

    clean(tag);
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

    const interactive = dirEntries === null || argsInclude('i', 'interact');

    const toClean = [];

    if (interactive) {
        console.log('Running interactively');

        toClean.push(tag);

        spawnSync('docker', [
            'run',
            '--interactive',
            '--tty',
            '--name', tag,
            tag,
            '/work/solution'
        ], { stdio: 'inherit' });
    }

    if (!interactive) {
        for (const entry of dirEntries) {
            const suffix = extname(entry);

            if (suffix != '.txt') continue;

            const name = `${tag}-${basename(entry,suffix)}`;
            const path = `${inputDir}/${entry}`;
            const txt = readFileSync(path, 'utf-8');

            console.log(`\n\n-------${'-'.repeat(entry.length)}-`);
            console.log(`INPUT (${entry})`);
            console.log(`-------${'-'.repeat(entry.length)}-`);
            console.log(txt);

            console.log('------');
            console.log('OUTPUT');
            console.log('------');

            toClean.push(name);

            const child = spawn('docker', [
                'run',
                '--interactive',
                '--name', name,
                tag,
                '/work/solution'
            ], {
                stdio: ['pipe', 'inherit', 'inherit'],
            });

            child.stdin.write(txt);

            await new Promise((resolve) => {
                child.on('exit', () => {
                    resolve();
                })
            });

            console.log();
        }
    }

    console.log('\nCleaning up containers');

    for (const name of toClean)
        spawnSync('docker', ['rm', '--volumes', name], {
            stdio: ['inherit', 'inherit', 'inherit']
        });
}

function clean(tag) {
    console.log('\nCleaning up image');

    spawnSync('docker', ['image', 'remove', '-f', tag], {
        stdio: ['inherit', 'inherit', 'inherit']
    });
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

function getFileHash(path) {
    const md5 = spawnSync('md5', ['-q', path], {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'inherit']
    });
    const hash = md5.stdout;

    return hash;
}

async function wait(milliseconds) {
    return new Promise((res) => {
        setTimeout(res, milliseconds)
    });
}