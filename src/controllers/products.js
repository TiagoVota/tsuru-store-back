import connection from '../database/database.js';

const productsList = async (req, res) => {
  const result = await connection.query(`
    SELECT
      id,
      name,
      price,
      image,
      category_id
    FROM products;
  `);

  res.send(result.rows);
};

export { productsList };