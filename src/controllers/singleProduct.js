import connection from '../database/database.js';

const getSingleProduct = async (req, res) => {
  try {
    const result = await connection.query(`
    SELECT 
      name,
      price,
      image
    FROM
      products
    WHERE
      id = $1
  `, [req.params.id]);

    res.send(result.rows[0]);
  } catch {
    res.sendStatus(404);
  }
};

export { getSingleProduct };