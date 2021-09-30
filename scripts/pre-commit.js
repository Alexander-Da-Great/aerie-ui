import { execSync } from 'child_process';

function exec(cmd) {
  try {
    const stdout = execSync(cmd).toString();
    console.log(stdout);
  } catch ({ stdout }) {
    const error = stdout.toString();
    console.log(error);
    throw new Error(error);
  }
}

function main() {
  exec('npm run format');
  exec('npm run lint');
  exec('npm run check');
}

main();
