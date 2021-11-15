import joi from 'joi';


const validateQuantity = joi.object({
  quantity: joi.number().integer().min(0)
}).length(1);


export default validateQuantity;