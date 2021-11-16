import connection from '../database/database.js';

const getHistory = async (req, res) => {
  const userId = req.userId;

  try {
    const sales = await connection.query(`
      SELECT
        *
      FROM
        sales
      WHERE
        user_id = $1
    `, [userId]);

    if (sales.rowCount !== 0) return res.send(sales.rows).status(200);

    
    return res.sendStatus(404);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
};

export { getHistory };