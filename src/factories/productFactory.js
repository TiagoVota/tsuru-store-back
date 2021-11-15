import faker from 'faker';

import connection from '../database/database.js';


faker.locale = 'pt_BR';

const createProduct = async ({name, categoryId}) => {
  name = name || faker.commerce.productName();
  const price = faker.commerce.price();
  const image = faker.image.imageUrl();

  await connection.query(`
    INSERT INTO 
      products (name, category_id, price, image)
    VALUES
     ($1, $2, $3, $4);
  `, [name, categoryId, price, image]);

  const productPromise = await connection.query(`
    SELECT * FROM products
      WHERE name = $1;
  `, [name]);

  return productPromise.rows[0];
};


export { createProduct };
