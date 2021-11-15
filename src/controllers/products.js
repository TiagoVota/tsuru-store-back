import connection from '../database/database.js';

const productsList = async (req, res) => {
  try {
    const result = await connection.query(`
    SELECT
      id,
      name,
      price,
      image,
      category_id
    FROM products;
  `);

    return res.send(result.rows);

  } catch (error) {
    // TODO: Aqui está caindo todos os erros que podem acontecer com as requisições do front
    // seria bacana ter um tratamento no try se um produto não existe no 404, e o catch ser mais
    // destinado somente a erros na requisição do database, daí você deixa um erro 500.
    // Dá uma olhada no que eu fiz para veres se curte a ideia :3
    console.log(error);
    return res.sendStatus(404);
  }
};

export { productsList };