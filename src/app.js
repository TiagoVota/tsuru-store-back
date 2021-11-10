import cors from 'cors';
import express from 'express';

import { auth } from './middlewares/auth.js';
import { login } from './controllers/signIn.js';
import { register } from './controllers/signUp.js';
import { productsList } from './controllers/products.js';
import { categoriesList } from './controllers/categories.js';
import { getSingleProduct } from './controllers/singleProduct.js';

const app = express();

app.use(cors());
app.use(express.json());


app.post('/sign-up', login);
app.post('/sign-up', register);

app.get('/products', productsList);
app.get('/categories', categoriesList);
app.get('/single-product/:id', getSingleProduct);

export default app;
