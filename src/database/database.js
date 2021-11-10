import pg from 'pg';

const { Pool } = pg;

const {
  DB_USER,
  DB_PASS,
  DB_PORT,
  DB_HOST,
  DB_NAME
} = process.env;

const connection = new Pool ({
  user: DB_USER,
  password: DB_PASS,
  port: DB_PORT,
  host: DB_HOST,
  database: DB_NAME
});

export default connection;