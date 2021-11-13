import cors from 'cors';
import express from 'express';

import { auth } from './middlewares/auth.js';
import { login } from './controllers/signIn.js';
import { register } from './controllers/signUp.js';
import { productsList } from './controllers/products.js';
import { categoriesList } from './controllers/categories.js';
import { getProduct, addCartProduct } from './controllers/product.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/', login);
app.post('/sign-up', register);

app.get('/products', auth, productsList);
app.get('/categories', auth, categoriesList);
app.get('/single-product/:productId', auth, getProduct);
app.post('/single-product/:productId', auth, addCartProduct);

app.get('/test', (req, res, next) => {
  req.userId = 10;
  console.log({req1: req});
  next();
}, (req, res) => {
  console.log({req2: req});
  return res.sendStatus(200);
});

export default app;
