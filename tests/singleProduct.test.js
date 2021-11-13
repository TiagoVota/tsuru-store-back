/* eslint-disable no-undef */
import supertest from 'supertest';
import faker from 'faker';

import '../src/setup.js';
import setup from '../src/factories/userFactory.js';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { cleanTableDatabase } from '../src/factories/deleteFactory.js';
import { v4 as uuid } from 'uuid';

beforeAll(async () => {
  await cleanTableDatabase('sessions');
  await cleanTableDatabase('users');
  await cleanTableDatabase('products');
  await createProduct();
});

afterAll(async () => {
  await cleanTableDatabase('sessions');
  await cleanTableDatabase('users');
  await cleanTableDatabase('products');
  connection.end();
});

faker.locale = 'pt_BR';

const createProduct = async () => {
  const name = 'Dragão de Origami';
  const image = faker.image.imageUrl();

  await connection.query(`
    INSERT INTO 
      products (name, category_id, price, image)
    VALUES
     ($1, 1, 12.22, $2)
  ;`, [name, image]);
};

const getProductId = async () => {
  const promisse = await connection.query(`
    SELECT 
      id 
    FROM 
      products 
    LIMIT 
      1
  ;`);

  return(promisse.rows[0].id);
};

describe('GET /single-product', () => {
  test('return 401 to invalid token', async () => {
    const token = uuid();
    await setup(token);
    const id =  await getProductId();
    await getSingleProduct('', 401, id);
  });

  test('return 404 to invalid id', async () => {
    const token = uuid();
    await setup(token);
    const id =  await getProductId();
    await getSingleProduct(token, 404, 'test');
  });

  test('return 200 to valid token', async () => {
    const token = uuid();
    await setup(token);
    const id =  await getProductId();
    await getSingleProduct(token, 200, id);
  });
});

const getSingleProduct = async (token, status, id) => {
  const result = await supertest(app)
    .get(`/single-product/${id}`)
    .set('authorization', `Bearer ${token}`);

  expect(result.status).toEqual(status);
};