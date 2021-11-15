import connection from '../database/database.js';

const populateCart = async (token, type) => {
  try {
    const user_id = await connection.query(`
      SELECT 
        users.id
      FROM
        users
      JOIN
        sessions
      ON
        sessions.user_id = users.id
      WHERE
        token = $1;
    `, [token]);

    await connection.query(`
      INSERT INTO
        carts (user_id)
      VALUES
        ($1);
    `, [user_id.rows[0].id]);

    if (type === 'correct') {
      const cart_id = await connection.query(`
        SELECT 
          id
        FROM
          carts
        WHERE
          user_id = $1;
      `, [user_id.rows[0].id]);

      await connection.query(`
        INSERT INTO
          carts_products (cart_id, product_id, quantity)
        VALUES  
          ($1, 1, 1);
      `, [cart_id.rows[0].id]);
      return;
    }
    return;
  } catch (error) {
    console.log(error);
    return;
  }
};

export default populateCart;