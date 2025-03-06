import { config } from 'dotenv';
import { spawn } from 'child_process';

// Load environment variables from .env.test
config({ path: '.env.test' });

// Run Bun tests
const testProcess = spawn('bun', ['test'], { stdio: 'inherit' });

testProcess.on('close', (code) => {
  process.exit(code);
});
