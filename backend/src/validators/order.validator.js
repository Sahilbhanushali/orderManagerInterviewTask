import Joi from 'joi';

export const createOrderSchema = Joi.object({
    customerId: Joi.string().required(),
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().required(),
                quantity: Joi.number().min(1).required()
            })
        )
        .min(1)
        .required()
});

export const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid('completed', 'cancelled')
        .required()
});
