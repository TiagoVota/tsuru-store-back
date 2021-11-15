import connection from '../database/database.js';

const createProductsInCart = async (productId, cartId) => {
  await connection.query(`
    INSERT INTO
      carts_products (cart_id, product_id, quantity)
    VALUES
      ($1, $2, $3);
  `, [cartId, productId, Math.cell(Math.ceil()*10)]);
};

export { createProductsInCart };