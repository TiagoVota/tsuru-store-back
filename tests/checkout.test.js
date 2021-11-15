/* eslint-disable no-undef */
import supertest from 'supertest';

import '../src/setup.js';
import setup from '../src/factories/userFactory.js';
import populateCart from '../src/factories/populateCart.js';
import { cleanTableDatabase } from '../src/factories/deleteFactory';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { v4 as uuid } from 'uuid';

beforeAll(async () => {
  await cleanTableDatabase('sales_products');
  await cleanTableDatabase('sales');
  await cleanTableDatabase('carts_products');
  await cleanTableDatabase('carts');
  await cleanTableDatabase('sessions');
  await cleanTableDatabase('users');
});

afterAll(async () => {
  connection.end();
});

describe('/POST checkout', () => {
  test('return 404 to empty cart', async () => {
    const token = uuid();
    await setup(token);
    await populateCart(token, 'Empty');
    await closeCart({token}, 404);
  });

  test('return 200 to not empty cart', async () => {
    const token = uuid();
    await setup(token);
    await populateCart(token, 'correct');
    await closeCart({token}, 200);
  });
});

const closeCart = async (body, status) => {
  const result = await supertest(app)
    .post('/checkout')
    .send(body);

  expect(result.status).toEqual(status);
};