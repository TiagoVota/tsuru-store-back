import connection from '../database/database.js';

const productsList = async (req, res) => {
  try {
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
  } catch {
    res.sendStatus(404);
  }
};

export { productsList };