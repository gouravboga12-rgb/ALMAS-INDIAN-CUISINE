import { execSync } from 'child_process';

console.log('=== Starting Git Operations ===');
try {
  console.log('1. Running git status...');
  console.log(execSync('git status', { encoding: 'utf8' }));

  console.log('2. Running git add . ...');
  console.log(execSync('git add .', { encoding: 'utf8' }));

  console.log('3. Running git commit...');
  try {
    const commitOut = execSync('git commit -m "feat: add Momo section, fix layout filtering, and update ecommerce buttons"', { encoding: 'utf8' });
    console.log(commitOut);
  } catch (ce) {
    console.log('Commit skipped or no changes: ' + (ce.stdout || ce.message));
  }

  console.log('4. Running git push...');
  console.log(execSync('git push', { encoding: 'utf8' }));

  console.log('=== Git operations completed successfully! ===');
} catch (err) {
  console.error('\n!!! Fatal Git Error:', err.stdout || err.stderr || err.message);
}
