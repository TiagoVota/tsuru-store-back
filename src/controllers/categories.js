import connection from '../database/database.js';

const categoriesList = async (req, res) => {
  try {
    const result = await connection.query(`
    SELECT
      id,
      type
    FROM categories;
  `);

    return res.send(result.rows);

  } catch (error) {
    // TODO: Dá uma olhada no que escrevi de comentário do products.js
    console.log(error);
    return res.sendStatus(404);
  }
};

export { categoriesList };