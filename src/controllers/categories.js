import connection from '../database/database.js';

const categoriesList = async (req, res) => {
  try {
    const result = await connection.query(`
    SELECT
      id,
      type
    FROM categories;
  `);

    res.send(result.rows);
  } catch {
    res.sendStatus(404);
  }
};

export { categoriesList };