/**
 * Swiitch Bank MVP - Database Configuration
 * PostgreSQL connection setup with connection pooling
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'swiitchbank_dev',
  user: process.env.DB_USER || 'swiitchbank_user',
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // Connection timeout
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Execute database query with error handling
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.info(`Executed query: ${text.substring(0, 50)}... Duration: ${duration}ms`);
    return result;
  } catch (error) {
    logger.error('Database query error:', error);
    throw error;
  }
};

/**
 * Get database client from pool
 */
const getClient = async () => {
  return await pool.connect();
};

/**
 * Test database connection
 */
const connectDB = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    logger.info('Database connected successfully at:', result.rows[0].now);
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

/**
 * Run database migrations
 */
const migrate = async () => {
  try {
    const migrationsPath = path.join(__dirname, '../../migrations');
    const migrationFiles = fs.readdirSync(migrationsPath).sort();
    
    logger.info('Running database migrations...');
    
    for (const file of migrationFiles) {
      if (file.endsWith('.sql')) {
        const migrationSQL = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
        await query(migrationSQL);
        logger.info(`Migration completed: ${file}`);
      }
    }
    
    logger.info('All migrations completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  }
};

module.exports = {
  pool,
  query,
  getClient,
  connectDB,
  migrate,
};