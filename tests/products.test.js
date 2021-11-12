/* eslint-disable no-undef */
import supertest from 'supertest';

import '../src/setup.js';
import setup from '../src/factories/userFactory.js';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { cleanTableDatabase } from '../src/factories/deleteFactory.js';
import { v4 as uuid } from 'uuid';


beforeAll(async () => {
  await cleanTableDatabase('sessions');
  await cleanTableDatabase('users');
});

afterAll(async () => {
  await cleanTableDatabase('sessions');
  await cleanTableDatabase('users');
  connection.end();
});

describe('GET /products', () => {
  test('return 401 to invalid token', async () => {
    const token = uuid();
    await setup(token);
    await getProducts('', 401);
  });

  test('return 200 to valid token', async () => {
    const token = uuid();
    await setup(token);
    await getProducts(token, 200);
  });
});

const getProducts = async (token, status) => {
  const result = await supertest(app)
    .get('/products')
    .set('authorization', `Bearer ${token}`);

  expect(result.status).toEqual(status);
};