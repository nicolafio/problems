const { spawnSync } = require('child_process');
const { basename } = require('path');

main();

function main() {
    const problem = basename(__dirname);
    const tag = `${problem}-build`;

    if (build(tag).status === 0) run(tag);
}

function build(tag) {
    return cmd('docker', 'build', '-t', tag, '-f', 'build.Dockerfile', '.');
}

function run(tag) {
    return cmd('docker', 'run', '-it', tag, '/work/solution');
}

function cmd(cmd, ...args) {
    return spawnSync(cmd, args, {
        stdio: 'inherit'
    });
}

