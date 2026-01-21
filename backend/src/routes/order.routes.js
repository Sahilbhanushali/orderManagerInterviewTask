import express from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
    createOrderSchema,
    updateOrderStatusSchema
} from '../validators/order.validator.js';

const router = express.Router();

router.get('/', OrderController.list);
router.post('/create', validate(createOrderSchema), OrderController.create);
router.get('/:id', OrderController.getById);
router.patch(
    '/:id/status',
    validate(updateOrderStatusSchema),
    OrderController.updateStatus
);
router.post('/:id/cancel', OrderController.cancel);

export default router;
