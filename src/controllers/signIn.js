import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import connection from '../database/database.js';
import { validateLogin } from '../validations/signIn.js';


const login = async (req, res) => {
  const { body: loginInfo } = req;
  const { email, password } = loginInfo;

  const inputErrors = validateLogin.validate(loginInfo).error;

  if (inputErrors) return res.status(400).send('Inputs inválidos!');

  try {
    const userPromise = await connection.query(`
      SELECT * FROM users
        WHERE email = $1;
    `, [email]);
    const user = userPromise.rows[0];


    const isValidPassword = bcrypt.compareSync(password, user?.password);

    if (!user || !isValidPassword) return res.status(401).send('E-mail ou senha inválido!');

    const { id, name } = user;

    const token = await makeSession(id);

    return res.status(200).send({token, name});

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};


const makeSession = async (userId) => {
  const token = uuid();

  const existentSessionId = await existentSession(userId);

  existentSessionId
    ? await updateSession(existentSessionId, token)
    : await insertSession(userId, token);

  return token;
};

const existentSession = async (userId) => {
  const existentUserPromise = await connection.query(`
    SELECT * FROM sessions
      WHERE user_id = $1;
  `, [userId]);
  const existentUser = existentUserPromise.rows[0];

  return existentUser?.id;
};


const updateSession = async (sessionId, token) => {
  await connection.query(`
  UPDATE sessions
  SET token = $1
    WHERE id = $2;
  `, [token, sessionId]);
};

const insertSession = async (userId, token) => {
  await connection.query(`
    INSERT INTO sessions
      (user_id, token)
    VALUES
      ($1, $2);
  `, [userId, token]);
};


export { login };
