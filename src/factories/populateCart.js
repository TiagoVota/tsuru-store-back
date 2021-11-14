import connection from '../database/database.js';

const populateCart = async (token, type) => {
  const promisse = await connection.query(`
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

  const user_id = promisse.rows[0].id;

  if (type === 'Empty') {
    await connection.query(`
      INSERT INTO
        carts (user_id)
      VALUES
        ($1);
    `, [user_id]);

    const cartId = await connection.query(`
      SELECT 
        id 
      FROM 
        carts
      WHERE
        user_id = $1;
    `, [user_id]);

    return (cartId.rows[0].id);
  }

  if (type === 'Closed') {
    await connection.query(`
      INSERT INTO
        carts (user_id, close_date)
      VALUES
        ($1, '14/11/21');
    `, [user_id]);

    const cartId = await connection.query(`
      SELECT 
        id 
      FROM 
       carts
      WHERE
        user_id = $1;
    `, [user_id]);

    await connection.query(`
      INSERT INTO 
        carts_products (cart_id, product_id, quantity)
      VALUES
        ($1, 1, 1);
    `, [cartId.rows[0].id]);


    return (cartId.rows[0].id);
  }

  else {
    await connection.query(`
      INSERT INTO
        carts (user_id)
      VALUES
        ($1);
    `, [user_id]);

    const cartId = await connection.query(`
      SELECT 
        id 
      FROM 
        carts
      WHERE
        user_id = $1;
    `, [user_id]);

    await connection.query(`
      INSERT INTO 
        carts_products (cart_id, product_id, quantity)
      VALUES
        ($1, 1, 1);
    `, [cartId.rows[0].id]);

    return (cartId.rows[0].id);
  }
};

export default populateCart;