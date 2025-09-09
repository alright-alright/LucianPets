#!/usr/bin/env node

/**
 * LucianPets Port Check Utility
 * Checks for available ports and potential conflicts
 */

import { findAvailablePort, getPortUsageStats, getServerInfo } from '../server/src/utils/portDetection.js';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.purple}🔥 ${msg}${colors.reset}\n${'='.repeat(40)}`)
};

async function main() {
  log.header('LucianPets Port Detection System');
  
  try {
    // Frontend ports
    log.info('Scanning for frontend ports...');
    const frontendPorts = [3000, 5173, 4173, 3001, 3002];
    const frontendPort = await findAvailablePort(frontendPorts);
    log.success(`Frontend port available: ${frontendPort}`);
    
    // Backend ports
    log.info('Scanning for backend ports...');
    const backendPorts = [8000, 8001, 8002, 8080, 5000];
    const backendPort = await findAvailablePort(backendPorts);
    log.success(`Backend port available: ${backendPort}`);
    
    // Port usage statistics
    log.header('Port Usage Analysis');
    const allPorts = [...frontendPorts, ...backendPorts];
    const stats = await getPortUsageStats(allPorts);
    
    console.log(`📊 Port Statistics:`);
    console.log(`   Total ports checked: ${stats.total}`);
    console.log(`   Available: ${stats.available}`);
    console.log(`   In use: ${stats.inUse}`);
    
    log.header('Recommended Configuration');
    console.log(`Frontend URL: http://localhost:${frontendPort}`);
    console.log(`Backend URL: http://localhost:${backendPort}`);
    console.log(`WebSocket URL: ws://localhost:${backendPort}`);
    
    // Server info
    log.header('System Information');
    const serverInfo = getServerInfo(backendPort);
    console.log(`Hostname: ${serverInfo.hostname}`);
    console.log(`Platform: ${serverInfo.platform.platform} ${serverInfo.platform.arch}`);
    console.log(`Memory: ${serverInfo.memory.free}MB free / ${serverInfo.memory.total}MB total`);
    
    if (serverInfo.networkInterfaces.length > 0) {
      log.info('Network interfaces:');
      serverInfo.networkInterfaces.forEach(iface => {
        console.log(`   ${iface.name}: ${iface.address}`);
      });
    }
    
    log.success('Port detection completed successfully!');
    
  } catch (error) {
    log.error(`Port detection failed: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
