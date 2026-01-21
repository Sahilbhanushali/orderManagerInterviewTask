import Joi from 'joi';

export const createCustomerSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required()
});
