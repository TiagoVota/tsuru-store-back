import connection from '../database/database.js';
import dayjs from 'dayjs';

const checkCartEmpty = async (user_id, res) => {
  try {
    const isThereCartOpen = await connection.query(`
      SELECT
        id
      FROM
        carts
      WHERE
        user_id = $1 AND close_date is null;
    `, [user_id]);

    if (isThereCartOpen.rowCount === 0) {
      res.sendStatus(404);
      return (false);
    }

    const isThereItensInCart = await connection.query(`
        SELECT
          *
        FROM 
          carts_products
        WHERE
          cart_id = $1
    ;`, [isThereCartOpen.rows[0].id]);

    if (isThereItensInCart.rowCount === 0) {
      res.sendStatus(404);
      return (false);
    }

    return (true);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
    return (false);
  }
};

const checkout = async (req, res) => {
  try {
    let promisse = await connection.query(`
      SELECT 
        users.id
      FROM
        users
      JOIN
        sessions
      ON
        sessions.user_id = users.id
      WHERE
        sessions.token = $1
    ;`, [req.body.token]);

    const user_id = promisse.rows[0].id;

    const isCartEmpty = await checkCartEmpty(user_id, res);

    if (isCartEmpty) {
      await connection.query(`
        UPDATE carts 
        SET close_date = $1
        WHERE user_id = $2 AND close_date is null;
      `, [dayjs().format('DD/MM/YY'), user_id]);

      res.sendStatus(200);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export { checkout };