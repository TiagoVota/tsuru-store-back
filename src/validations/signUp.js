import joi from 'joi';


const validateRegister = joi.object({
  name: joi.string().min(3).max(60).required(),
  email: joi.string().email().max(60).required(),
  cpf: joi.string().length(11).required(),
  password: joi.string().min(3).max(60).required(),
  repeatPassword: joi.ref('password')
}).length(5);


export { validateRegister };