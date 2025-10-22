const { Pool } = require('pg');
const axios = require('axios');

// Environment helper
const env = (key) => process.env[key] || '';

// Logging helper
const log = (...args) => console.log(`[${new Date().toISOString()}]`, ...args);

// JSON response helper
const jsonResponse = (body, status = 200) => {
  return {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    body: JSON.stringify(body)
  };
};

// PostgreSQL client helper
let pool = null;

const getDbPool = () => {
  if (!pool) {
    const connectionString = env('DATABASE_URL') || env('DATABASE_PUBLIC_URL');
    
    if (!connectionString) {
      throw new Error('Missing DATABASE_URL environment variable');
    }
    
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
    });
  }
  
  return pool;
};

// Database query helper
const dbQuery = async (query, params = []) => {
  const pool = getDbPool();
  const client = await pool.connect();
  
  try {
    const result = await client.query(query, params);
    return { data: result.rows, error: null };
  } catch (error) {
    log('Database query error:', error);
    return { data: null, error };
  } finally {
    client.release();
  }
};

// HTTP client with retry logic
const httpJson = async (url, options = {}) => {
  const timeoutMs = options.timeoutMs || 8000;
  const retries = options.retries || 2;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios({
        url,
        method: options.method || 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'BlockchainEye/1.0',
          ...options.headers
        },
        timeout: timeoutMs,
        data: options.body
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 429) {
        // Rate limit: exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      
      if (attempt === retries) {
        log('HTTP request failed after retries:', error.message);
        return null;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return null;
};

// Rounding helper
const roundN = (value, decimals = 6) => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

// Time bucket helper (5 minutes)
const bucket5mKey = (ms) => {
  return Math.floor(ms / (5 * 60 * 1000));
};

// CORS handler
const corsHandler = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

module.exports = {
  env,
  log,
  jsonResponse,
  getDbPool,
  dbQuery,
  httpJson,
  roundN,
  bucket5mKey,
  corsHandler
};
