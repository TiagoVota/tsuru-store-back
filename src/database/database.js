import pg from 'pg';

const { Pool } = pg;


const {
  NODE_ENV,
  DB_USER,
  DB_PASS,
  DB_PORT,
  DB_HOST,
  DB_NAME,
} = process.env;

const databaseConfig = (NODE_ENV === 'production')
  ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    }
  }
  : {
    user: DB_USER,
    password: DB_PASS,
    port: DB_PORT,
    host: DB_HOST,
    database: DB_NAME
  };

const connection = new Pool (databaseConfig);


export default connection;