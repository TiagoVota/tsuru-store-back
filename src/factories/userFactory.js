
import faker from 'faker';

import connection from '../database/database.js';
import { fakerCpf } from './fakerCpfFactory.js';

faker.locale = 'pt_BR';

const setup = async (token) => {
  const name = faker.name.firstName();
  const email = faker.internet.email();
  const cpf = fakerCpf();
  const password = faker.internet.password();

  await connection.query(`
    INSERT INTO 
      users (name, email, cpf, password)
    VALUES 
      ($1, $2, $3, $4);
  `, [name, email, cpf, password]);

  const user_id = await connection.query(`
    SELECT
      id
    FROM
      users
    WHERE
      cpf = $1;
  `, [cpf]);

  await connection.query(`
    INSERT INTO
      sessions (user_id, token)
    VALUES
      ($1, $2);
  `, [user_id.rows[0].id, token]);
};

export default setup;