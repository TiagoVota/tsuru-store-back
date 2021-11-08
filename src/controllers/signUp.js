import bcrypt from 'bcrypt';

import connection from '../database/database.js';
import { validateRegister } from '../validations/signUp.js';


const register = async (req, res) => {
  const userInfo = req.body;
  const {
    name,
    email,
    cpf,
    password,
  } = userInfo;

  const inputsErrors = validateRegister.validate(userInfo).error;

  if (inputsErrors) return res.status(400).send('Inputs inválidos!');

  const hash = bcrypt.hashSync(password, 12);

  try {

    const isAlreadyRegistered = await haveExistentEmailOrCpf(email, cpf);

    if (isAlreadyRegistered) return res.status(409).send('E-mail ou CPF já registrado!');

    await connection.query(`
      INSERT INTO users
        (name, email, cpf, password)
      VALUES
        ($1, $2, $3, $4);
    `, [name, email, cpf, hash]);

    return res.status(201).send({name, email, cpf});

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

const haveExistentEmailOrCpf = async (email, cpf) => {
  const usersPromise = await connection.query(`
    SELECT * FROM users
      WHERE
        email = $1
      OR
        cpf = $2;
  `, [email, cpf]);

  return usersPromise.rowCount !== 0;
};


export { register };
