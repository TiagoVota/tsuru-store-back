/* eslint-disable no-undef */
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';

import '../src/setup.js';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { userFactory } from '../src/factories/userFactory.js';
import { clearAllTables } from '../src/factories/deleteFactory.js';


const [token, invalidToken] = [uuid(), uuid()];

beforeAll(async () => {
  await clearAllTables();
  await userFactory(token);
});

afterAll(async () => {
  await clearAllTables();
  await connection.end();
});

describe('GET /products', () => {
  test('return 401 to invalid token', async () => {
    await getProducts(invalidToken, 401);
  });

  test('return 200 to valid token', async () => {
    await getProducts(token, 200);
  });
});

const getProducts = async (token, status) => {
  const result = await supertest(app)
    .get('/products')
    .set('authorization', `Bearer ${token}`);

  expect(result.status).toEqual(status);
};
