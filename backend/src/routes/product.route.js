import express from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
    createProductSchema,
    updateProductSchema
} from '../validators/product.validator.js';

const router = express.Router();

router.get('/', ProductController.list);
router.post('/create', validate(createProductSchema), ProductController.create);
router.get('/:id', ProductController.getById);
router.put('/:id', validate(updateProductSchema), ProductController.update);
router.put('/delete/:id', ProductController.delete);

export default router;
