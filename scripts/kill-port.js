#!/usr/bin/env node
/**
 * Frees the port from .env (or default) before starting dev server.
 * Usage: node scripts/kill-port.js [port]
 */
const { execSync } = require('child_process');
const fs = require('fs');

const defaultPorts = {
  'smart-workspace-gateway': '3000',
  'smart-workspace-auth-service': '3001',
  'smart-workspace-service-template': '3000',
};

function resolvePort() {
  if (process.argv[2]) {
    return process.argv[2];
  }

  if (process.env.PORT) {
    return process.env.PORT;
  }

  if (fs.existsSync('.env')) {
    const match = fs.readFileSync('.env', 'utf8').match(/^PORT=(\d+)/m);
    if (match) {
      return match[1];
    }
  }

  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return defaultPorts[pkg.name] ?? '3000';
  } catch {
    return '3000';
  }
}

const port = resolvePort();

try {
  const pids = execSync(`lsof -ti :${port}`, { encoding: 'utf8' }).trim();
  if (pids) {
    for (const pid of pids.split('\n').filter(Boolean)) {
      try {
        process.kill(Number(pid), 'SIGKILL');
      } catch {
        // process may already be gone
      }
    }
    console.log(`Freed port ${port} (stopped PID: ${pids.replace(/\n/g, ', ')})`);
  } else {
    console.log(`Port ${port} is already free`);
  }
} catch {
  console.log(`Port ${port} is already free`);
}
