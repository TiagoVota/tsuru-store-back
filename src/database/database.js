import pg from 'pg';

const { Pool } = pg;


const { DATABASE_URL } = process.env;

const databaseConfig = {
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
};

const connection = new Pool (databaseConfig);


export default connection;