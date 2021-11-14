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

    res.send(result.rows[0]);
  } catch {
    res.sendStatus(404);
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

    await insertProduct(cartId, productId);

    return res.status(200).send({cartId});
    
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};


const getCartId = async (userId) => {
  let cartId = await existentCartId(userId);

  if (!cartId) cartId = await createCart(userId);

  return cartId;
};

const existentCartId = async (userId) => {
  const userCartPromise = await connection.query(`
    SELECT * FROM carts
      WHERE user_id = $1 AND close_date IS NULL;
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

  return await existentCartId(userId);
};

const insertProduct = async (cartId, productId) => {
  await connection.query(`
    INSERT INTO carts_products
      (cart_id, product_id)
    VALUES
      ($1, $2);
  `, [cartId, productId]);
};


export {
  getProduct,
  addCartProduct
};