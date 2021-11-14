/* eslint-disable no-undef */
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';

import '../src/setup.js';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { userFactory } from '../src/factories/userFactory.js';
import { clearAllTables } from '../src/factories/deleteFactory.js';
import { createCategory } from '../src/factories/categoryFactory.js';
import { createProduct } from '../src/factories/productFactory.js';


let productId = 0;
const [token, otherToken] = [uuid(), uuid()];

beforeAll(async () => {
  await clearAllTables();

  await userFactory(token);

  const category = await createCategory();
  const categoryId = category.id;

  const product = await createProduct({categoryId});
  productId = product.id;
});

afterAll(async () => {
  await clearAllTables();
  await connection.end();
});

describe('GET /single-product', () => {
  test('return 401 to invalid token', async () => {
    await getSingleProduct(otherToken, 401, productId);
  });

  test('return 404 to invalid id', async () => {
    const incorrectProductId = 'test';
    await getSingleProduct(token, 404, incorrectProductId);
  });

  test('return 200 to valid token', async () => {
    await getSingleProduct(token, 200, productId);
  });
});

const getSingleProduct = async (token, status, productId) => {
  const result = await supertest(app)
    .get(`/single-product/${productId}`)
    .set('authorization', `Bearer ${token}`);

  expect(result.status).toEqual(status);
};
