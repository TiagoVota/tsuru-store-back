import connection from '../database/database.js';
import { theValidationProceeded } from '../validations/handleValidation.js';
import validateQuantity from '../validations/product.js';


const getProduct = async (req, res) => {
  try {
    const result = await connection.query(`
    SELECT 
      name, price, image
    FROM
      products
    WHERE
      id = $1
  `, [req.params.productId]);

    return res.send(result.rows[0]);

  } catch (error) {
    // TODO: dá uma olhada no que escrevi em products
    console.log(error);
    return res.sendStatus(404);
  }
};


const addCartProduct = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.userId;

  const isValidQuantity = theValidationProceeded({
    res,
    status: 400,
    objectToValid: {quantity},
    objectValidation: validateQuantity
  });

  if (!isValidQuantity) return;

  try {
    const cartId = await getCartId(userId);

    const upsertInfo = {cartId, productId, quantity};

    await upsertProduct(upsertInfo);

    return res.status(200).send(upsertInfo);
    
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};


const getCartId = async (userId) => {
  let cartId = await selectCartId(userId);

  if (!cartId) cartId = await createCart(userId);

  return cartId;
};

const selectCartId = async (userId) => {
  const userCartPromise = await connection.query(`
    SELECT * FROM carts
      WHERE user_id = $1;
  `, [userId]);

  return userCartPromise.rows[0]?.id;
};

const createCart = async (userId) => {
  await connection.query(`
    INSERT INTO carts
      (user_id)
    VALUES
      ($1);
  `, [userId]);

  return await selectCartId(userId);
};

const upsertProduct = async ({ cartId, productId, quantity }) => {
  const queryCondition = 'WHERE cart_id = $1 AND product_id = $2';
  const updateQuery = `
    UPDATE carts_products
      SET quantity = $3 ${queryCondition};
  `;
  const insertQuery = `
    INSERT INTO carts_products
      (cart_id, product_id, quantity)
    SELECT
      $1, $2, $3
      WHERE NOT EXISTS
        (SELECT * FROM carts_products ${queryCondition});
  `;

  await connection.query(updateQuery, [cartId, productId, quantity]);
  await connection.query(insertQuery, [cartId, productId, quantity]);
};


export {
  getProduct,
  addCartProduct
};