/* eslint-disable no-undef */
import supertest from 'supertest';
import faker from 'faker';

import '../src/setup.js';
import app from '../src/app.js';
import connection from '../src/database/database.js';
import { clearAllTables } from '../src/factories/deleteFactory.js';
import { fakerCpf } from '../src/factories/fakerCpfFactory.js';


beforeAll(clearAllTables);

afterAll(async () => {
  await clearAllTables();
  await connection.end();
});


faker.locale = 'pt_BR';

const name = faker.name.firstName();
const email = faker.internet.email();
const invalidEmail = '';
const cpf = fakerCpf();
const otherCpf = fakerCpf();
const password = faker.internet.password();
const otherPassword = faker.internet.password();
const repeatPassword = password;


describe('POST /sign-up', () => {
  const validBody = {
    name,
    email,
    cpf,
    password,
    repeatPassword,
  };

  const invalidBody = {
    ...validBody,
    email: invalidEmail,
  };
  
  const incorrectBody = {
    ...validBody,
    cpf: otherCpf,
  };

  
  test('Return 400 for invalid body', async () => {
    await registerTest(invalidBody, 400);
  });

  test('Return 201 for correct body', async () => {
    await registerTest(validBody, 201);
  });

  test('Return 409 for conflict body', async () => {
    await registerTest(incorrectBody, 409);
  });
});

describe('POST /sign-in', () => {
  const validBody = {
    email,
    password,
  };
  
  const invalidBody = {
    ...validBody,
    email: invalidEmail,
  };

  const incorrectBody = {
    ...validBody,
    password: otherPassword,
  };

  
  test('Return 400 for invalid body', async () => {
    await loginTest(invalidBody, 400);
  });

  test('Return 200 for correct body', async () => {
    await loginTest(validBody, 200);
  });

  test('Return 401 for unauthorized body', async () => {
    await loginTest(incorrectBody, 401);
  });
});


const registerTest = async (body, status) => {
  const result = await supertest(app)
    .post('/sign-up')
    .send(body);

  expect(result.status).toEqual(status);
};

const loginTest = async (body, status) => {
  const result = await supertest(app)
    .post('/sign-in')
    .send(body);

  expect(result.status).toEqual(status);
};
