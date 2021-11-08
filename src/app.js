import cors from 'cors';
import express from 'express';

import { auth } from './middlewares/auth.js';
import { login } from './controllers/signIn.js';
import { register } from './controllers/signUp.js';

const app = express();

app.use(cors());
app.use(express.json());


app.post('/', login);
app.post('/sign-up', register);


export default app;
