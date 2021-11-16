import connection from '../database/database.js';

const createProductsInCart = async (productId, cartId) => {
  await connection.query(`
    INSERT INTO
      carts_products (cart_id, product_id, quantity)
    VALUES
      ($1, $2, $3);
  `, [cartId, productId, Math.ceil(Math.random()*10)]);
};

export { createProductsInCart };