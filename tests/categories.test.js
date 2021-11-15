/* eslint-disable no-undef */
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';

import '../src/setup.js';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { clearAllTables } from '../src/factories/deleteFactory.js';
import { userFactory } from '../src/factories/userFactory.js';
import { createCategory } from '../src/factories/categoryFactory.js';


const [token, incorrectToken] = [uuid(), uuid()];

beforeAll(async () => {
  await clearAllTables();
  await userFactory(token);
  await createCategory();
});

afterAll(async () => {
  await clearAllTables();
  await connection.end();
});

describe('GET /categories', () => {
  test('return 401 to invalid token', async () => {
    await getCategories(incorrectToken, 401);
  });

  test('return 200 to valid token', async () => {
    await getCategories(token, 200);
  });
});

const getCategories = async (token, status) => {
  const result = await supertest(app)
    .get('/categories')
    .set('authorization', `Bearer ${token}`);

  expect(result.status).toEqual(status);
};