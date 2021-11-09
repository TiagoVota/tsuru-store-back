import connection from '../database/database.js';

const categoriesList = async (req, res) => {
  const result = await connection.query(`
    SELECT
      id,
      type
    FROM categories;
  `);

  res.send(result.rows);
};

export { categoriesList };