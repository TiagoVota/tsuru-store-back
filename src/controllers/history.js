import connection from '../database/database.js';

const getHistory = async (req, res) => {
  const token = req.body.authorization.replace('Bearer ', '');

  try {
    const userId = await connection.query(`
      SELECT
        users.id
      FROM
        users
      JOIN
        sessions
      ON
        users.id = sessions.user_id
      WHERE 
        sessions.token = $1;
    `, [token]);

    const sales = await connection.query(`
      SELECT
        *
      FROM
        sales
      WHERE
        user_id = $1
    `, [userId.rows[0].id]);

    if (sales.rowCount !== 0) {
      res.send(sales.rows).status(200);
      return;
    }

    res.sendStatus(404);
    return;
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
    return;
  }
};

export { getHistory };