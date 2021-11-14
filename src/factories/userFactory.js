
import faker from 'faker';
import bcrypt from 'bcrypt';

import connection from '../database/database.js';
import { fakerCpf } from './fakerCpfFactory.js';


faker.locale = 'pt_BR';

const userFactory = async (token) => {
  const user = await createUser();
  
  const session = await createSession(user.id, token);

  return { user, session };
};

const createUser = async () => {
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const cpf = fakerCpf();
  const password = faker.internet.password();
  const hash = bcrypt.hashSync(password, 12);

  await connection.query(`
    INSERT INTO users
      (name, email, cpf, password)
    VALUES 
      ($1, $2, $3, $4);
  `, [name, email, cpf, hash]);

  const userPromise = await connection.query(`
    SELECT * FROM users
      WHERE cpf = $1;
  `, [cpf]);

  return userPromise.rows[0];
};

const createSession = async (userId, token) => {
  await connection.query(`
    INSERT INTO sessions 
      (user_id, token)
    VALUES
      ($1, $2);
  `, [userId, token]);

  const sessionPromise = await connection.query(`
    SELECT * FROM sessions
      WHERE token = $1;
  `, [token]);

  return sessionPromise.rows[0];
};

export { userFactory };
