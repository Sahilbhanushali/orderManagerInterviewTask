import Joi from 'joi';

export const createProductSchema = Joi.object({
    name: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required()
});

export const updateProductSchema = Joi.object({
    name: Joi.string().trim(),
    price: Joi.number().min(0),
    stock: Joi.number().min(0)
});
