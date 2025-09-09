import { createServer } from 'net';
import os from 'os';

/**
 * Smart Port Detection System
 * Finds available ports automatically and provides server info
 */

/**
 * Check if a port is available
 * @param {number} port - Port to check
 * @returns {Promise<boolean>} - True if port is available
 */
export const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.listen(port, () => {
      server.close(() => {
        resolve(true);
      });
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
};

/**
 * Find the first available port from a list of preferred ports
 * @param {number[]} preferredPorts - Array of preferred ports to try
 * @param {number} fallbackStart - Starting port for fallback range (default: 8000)
 * @param {number} fallbackEnd - Ending port for fallback range (default: 9000)
 * @returns {Promise<number>} - Available port number
 */
export const findAvailablePort = async (
  preferredPorts = [8000, 8001, 8002, 8080, 3001, 5000],
  fallbackStart = 8000,
  fallbackEnd = 9000
) => {
  console.log('🔍 Scanning for available ports...');
  
  // Try preferred ports first
  for (const port of preferredPorts) {
    const available = await isPortAvailable(port);
    if (available) {
      console.log(`✅ Found available preferred port: ${port}`);
      return port;
    } else {
      console.log(`❌ Port ${port} is in use`);
    }
  }
  
  console.log('⚠️ No preferred ports available, scanning fallback range...');
  
  // Fallback to scanning a range
  for (let port = fallbackStart; port <= fallbackEnd; port++) {
    const available = await isPortAvailable(port);
    if (available) {
      console.log(`✅ Found available fallback port: ${port}`);
      return port;
    }
  }
  
  throw new Error(`❌ No available ports found in range ${fallbackStart}-${fallbackEnd}`);
};

/**
 * Get network interface information
 * @returns {Array} - Array of network interfaces
 */
export const getNetworkInterfaces = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          name,
          address: iface.address,
          type: 'IPv4'
        });
      }
    }
  }
  
  return addresses;
};

/**
 * Get comprehensive server information
 * @param {number} port - Server port
 * @returns {Object} - Server information object
 */
export const getServerInfo = (port) => {
  const networkInterfaces = getNetworkInterfaces();
  const hostname = os.hostname();
  
  return {
    port,
    hostname,
    url: `http://localhost:${port}`,
    networkInterfaces,
    localUrls: networkInterfaces.map(iface => `http://${iface.address}:${port}`),
    websocketUrl: `ws://localhost:${port}`,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    platform: {
      type: os.type(),
      platform: os.platform(),
      arch: os.arch(),
      release: os.release()
    },
    memory: {
      total: Math.round(os.totalmem() / 1024 / 1024),
      free: Math.round(os.freemem() / 1024 / 1024)
    }
  };
};

/**
 * Check for port conflicts with common services
 * @param {number} port - Port to check
 * @returns {string|null} - Warning message if conflict detected, null otherwise
 */
export const checkPortConflicts = (port) => {
  const commonPorts = {
    80: 'HTTP (Web Server)',
    443: 'HTTPS (Secure Web Server)',
    3000: 'React Development Server',
    3001: 'Common Development Server',
    5000: 'Flask/Python Development Server',
    5173: 'Vite Development Server',
    8000: 'Common Development Server',
    8080: 'HTTP Alternate (Tomcat, Jenkins)',
    9000: 'Common Application Server'
  };
  
  if (commonPorts[port]) {
    return `⚠️ Port ${port} is commonly used by: ${commonPorts[port]}`;
  }
  
  return null;
};

/**
 * Generate QR code data for easy mobile connection
 * @param {number} port - Server port
 * @returns {Object} - QR code connection data
 */
export const generateConnectionQR = (port) => {
  const networkInterfaces = getNetworkInterfaces();
  const primaryInterface = networkInterfaces[0];
  
  if (!primaryInterface) {
    return {
      url: `http://localhost:${port}`,
      displayText: 'localhost'
    };
  }
  
  return {
    url: `http://${primaryInterface.address}:${port}`,
    displayText: `${primaryInterface.address}:${port}`,
    networkName: primaryInterface.name
  };
};

/**
 * Validate port number
 * @param {number} port - Port to validate
 * @returns {boolean} - True if valid
 */
export const isValidPort = (port) => {
  return Number.isInteger(port) && port >= 1 && port <= 65535;
};

/**
 * Get port usage statistics
 * @param {number[]} ports - Ports to check
 * @returns {Promise<Object>} - Port usage statistics
 */
export const getPortUsageStats = async (ports) => {
  const stats = {
    total: ports.length,
    available: 0,
    inUse: 0,
    details: []
  };
  
  for (const port of ports) {
    const available = await isPortAvailable(port);
    const conflict = checkPortConflicts(port);
    
    stats.details.push({
      port,
      available,
      conflict
    });
    
    if (available) {
      stats.available++;
    } else {
      stats.inUse++;
    }
  }
  
  return stats;
};

export default {
  isPortAvailable,
  findAvailablePort,
  getNetworkInterfaces,
  getServerInfo,
  checkPortConflicts,
  generateConnectionQR,
  isValidPort,
  getPortUsageStats
};
