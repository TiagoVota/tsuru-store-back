import connection from '../database/database.js';


const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split('Bearer ')[1];

  try {
    const sessions = await connection.query(`
      SELECT * FROM sessions
        WHERE token = $1;
    `, [token]);

    if (sessions.rowCount === 0) return res.sendStatus(401);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }

  next();
};


export {
  auth,
};