import cors from 'cors';
import express from 'express';

import { auth } from './middlewares/auth.js';
import { login } from './controllers/signIn.js';
import { register } from './controllers/signUp.js';
import { productsList } from './controllers/products.js';
import { categoriesList } from './controllers/categories.js';
import { checkout } from './controllers/checkout.js';
import { getProduct, addCartProduct } from './controllers/product.js';

const app = express();


app.use(cors());
app.use(express.json());

app.post('/sign-in', login);
app.post('/sign-up', register);
app.post('/checkout', checkout);

app.get('/products', auth, productsList);
app.get('/categories', auth, categoriesList);
app.get('/single-product/:productId', auth, getProduct);
app.post('/single-product/:productId', auth, addCartProduct);


export default app;
