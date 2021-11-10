import joi from 'joi';


const validateLogin = joi.object({
  email: joi.string().email().max(60).required(),
  password: joi.string().min(3).max(60).required()
}).length(2);


export { validateLogin };
