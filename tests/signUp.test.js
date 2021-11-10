/* eslint-disable no-undef */
import supertest from 'supertest';
import faker from 'faker';

import '../src/setup.js';
import app from '../src/app.js';
import connection from '../src/database/database.js';


const cleanUsersDatabase = async () => await connection.query('DELETE FROM users;');

beforeAll(cleanUsersDatabase);
afterAll(async () => {
  await cleanUsersDatabase();
  connection.end();
});

describe('POST /sign-up', () => {

  faker.locale = 'pt_BR';

  const fakerCpf = () => String(faker.datatype.number({
    min:10000000000,
    max: 99999999999
  }));

  const name = faker.name.firstName();
  const email = faker.internet.email();
  const cpf = fakerCpf();
  const password = faker.internet.password();
  
  const invalidBody = {
    name: name,
    email: '',
    cpf: cpf,
    password: password,
    repeatPassword: password
  };

  const validBody = {
    name: name,
    email: email,
    cpf: cpf,
    password: password,
    repeatPassword: password
  };

  const incorrectBody = {
    name: name,
    email: email,
    cpf: fakerCpf(),
    password: password,
    repeatPassword: password
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


const registerTest = async (body, status) => {
  const result = await supertest(app)
    .post('/sign-up')
    .send(body);

  expect(result.status).toEqual(status);
};
