import connection from '../database/database.js';


const getCart = async (req, res) => {
  const userId = req.userId;

  try {
    const cartId = await getCartId(userId);

    if (!cartId) return res.status(200).send([]);

    const cartList = await selectCartProducts(cartId);

    return res.status(200).send(cartList);

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const getCartId = async (userId) => {
  const cartPromise = await connection.query(`
    SELECT * FROM carts
      WHERE user_id = $1;
  `, [userId]);

  return cartPromise.rows[0]?.id;
};

const selectCartProducts = async (cartId) => {
  const cartProductsPromise = await connection.query(`
    SELECT pd.id, pd.name, pd.price, cp.quantity, pd.image
    FROM carts_products AS cp
      JOIN products AS pd
        ON pd.id = cp.product_id
      WHERE cart_id = $1;
  `, [cartId]);

  return cartProductsPromise.rows;
};


export { getCart };
