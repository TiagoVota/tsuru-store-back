import connection from '../database/database.js';

const getSale = async (req, res) => {
  const idSale = req.body.id;

  try {
    const listProducts = await connection.query(`
    SELECT
      products.name, products.price, sales_products.quantity
    FROM
      sales_products
    JOIN
      products
    ON
      sales_products.product_id = products.id
    WHERE
      sales_products.sale_id = $1;
  `, [idSale]);

    res.send(listProducts.rows).status(200);
    return;
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
    return;
  }

};

export { getSale };