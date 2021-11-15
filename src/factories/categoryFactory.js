import faker from 'faker';

import connection from '../database/database';


faker.locale = 'pt_BR';

const createCategory = async (type) => {
  type = type || faker.commerce.department();

  await connection.query(`
    INSERT INTO categories
      (type)
    VALUES
      ($1);
  `, [type]);

  const categoryPromise = await connection.query(`
    SELECT * FROM categories
      WHERE type = $1;
  `, [type]);

  return categoryPromise.rows[0];
};


export { createCategory };
