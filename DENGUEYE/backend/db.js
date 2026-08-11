import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

// Reuse a single pool across serverless/warm invocations
if (!globalThis.__pgPool) {
  globalThis.__pgPool = new Pool({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    max: config.db.max,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
}

export const pool = globalThis.__pgPool;

export const query = async (text, params = []) => {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
};
