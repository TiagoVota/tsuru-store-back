import connection from '../database/database.js';
import dayjs from 'dayjs';

const checkout = async (req, res) => {
  const userId = req.userId;
  console.log({userId});

  try {
    const cartId = await connection.query(`
      SELECT
        id
      FROM
        carts
      WHERE
        user_id = $1;
    `, [userId]);
    
    if (cartId.rowCount === 0) return res.sendStatus(404);

    const productsInCart = await connection.query(`
      SELECT
        product_id, quantity
      FROM 
        carts_products
      WHERE
        cart_id = $1;
    `, [cartId.rows[0].id]);

    if (productsInCart.rowCount === 0) return res.sendStatus(404);

    await connection.query(`
      INSERT INTO
        sales (user_id, time)
      VALUES 
        ($1, $2);
    `, [userId, dayjs().format('DD/MM/YY')]);

    const sales_id = await connection.query(`
      SELECT
        id
      FROM
        sales
      WHERE
        user_id = $1
      ORDER BY
        id DESC
      LIMIT 1;
    `, [userId]);

    productsInCart.rows.forEach(async (product) => {
      await connection.query(`
        INSERT INTO
          sales_products (sale_id, product_id, quantity)
        VALUES
          ($1, $2, $3);
      `, [sales_id.rows[0].id, product.product_id, product.quantity]);
    });

    await connection.query(`
      DELETE FROM
        carts_products
      WHERE
        cart_id = $1;
    `, [cartId.rows[0].id]);

    await connection.query(`
      DELETE FROM
        carts
      WHERE
        user_id = $1;
    `, [userId]);

    return res.sendStatus(200);

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export { checkout };