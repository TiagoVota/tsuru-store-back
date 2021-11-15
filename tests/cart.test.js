/* eslint-disable no-undef */
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import faker from 'faker';

import '../src/setup.js';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { clearAllTables } from '../src/factories/deleteFactory.js';
import { userFactory } from '../src/factories/userFactory.js';
import { createCategory } from '../src/factories/categoryFactory.js';
import { createProduct } from '../src/factories/productFactory.js';


const token = uuid();
let productId = 0;
const quantity = faker.datatype.number({min: 0});

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

describe('POST /single-product', () => {
  test('return 400 for invalid quantity', async () => {
    const invalidQuantity = '';
    await postProduct(token, 400, productId, invalidQuantity);
  });

  test('return 200 for product insert success in cart', async () => {
    await postProduct(token, 200, productId, quantity);
  });
});

const postProduct = async (token, status, productId, quantity) => {
  const result = await supertest(app)
    .post(`/single-product/${productId}`)
    .set('authorization', `Bearer ${token}`)
    .send({quantity});

  expect(result.status).toEqual(status);
};
