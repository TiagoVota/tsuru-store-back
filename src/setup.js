import dotenv from 'dotenv';


const { NODE_ENV } = process.env;

const path = (NODE_ENV === 'prod') ? '.env' : '.env.test';

dotenv.config({
  path
});
