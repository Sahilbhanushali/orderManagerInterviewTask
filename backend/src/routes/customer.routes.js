import express from 'express';
import { CustomerController } from '../controllers/customer.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCustomerSchema } from '../validators/customer.validator.js';

const router = express.Router();

router.get('/', CustomerController.list);
router.post('/create', validate(createCustomerSchema), CustomerController.create);
router.get('/:id', CustomerController.getById);
router.put('/:id', CustomerController.update);
router.put('/delete/:id', CustomerController.delete);

export default router;
