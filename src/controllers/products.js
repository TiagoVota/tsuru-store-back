import connection from '../database/database.js';

const productsList = async (req, res) => {
  const result = await connection.query(`
    SELECT
      name,
      price,
      image
    FROM products;
  `);

  console.log(result.rows);
  res.send(result.rows);
};

export { productsList };