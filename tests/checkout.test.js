/* eslint-disable no-undef */
import supertest from 'supertest';

import '../src/setup.js';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { clearAllTables } from '../src/factories/deleteFactory.js';
import { userFactory } from '../src/factories/userFactory.js';
import { createCart } from '../src/factories/cartFactory.js';
import { v4 as uuid } from 'uuid';
import { createCategory } from '../src/factories/categoryFactory.js';
import { createProduct } from '../src/factories/productFactory.js';
import { createProductsInCart } from '../src/factories/cartProductsFactory.js';

beforeAll(async () => {
  await clearAllTables();
});

afterAll(async () => {
  await clearAllTables();
  connection.end();
});

describe('/POST checkout', () => {
  test('return 404 to empty cart', async () => {
    const token = uuid();
    await userFactory(token);
    await createCategory('teste 1');
    await closeCart({token}, 404);
  });

  test('return 200 to not empty cart', async () => {
    const token = uuid();
    const userInfo = await userFactory(token);
    const category = await createCategory();
    const categoryId = category.id;
    const product = await createProduct({categoryId});
    const cart = await createCart(userInfo.user.id);
    await createProductsInCart(product.id, cart.id);
    await closeCart({token}, 200);
  });
});

const closeCart = async (body, status) => {
  const result = await supertest(app)
    .post('/checkout')
    .send(body);

  expect(result.status).toEqual(status);
};