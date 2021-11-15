import connection from '../database/database.js';

const createCart = async (userId) => {
  try {
    await connection.query(`
      INSERT INTO
        carts (user_id)
      VALUES
        ($1);
    `, [userId]);

    const carts = await connection.query(`
      SELECT
        *
      FROM 
        carts;
    `);

    return (carts.rows[0]);
  } catch (error) {
    console.log(error);
    return;
  }
};

export { createCart };