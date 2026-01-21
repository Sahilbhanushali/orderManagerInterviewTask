import { ProductService } from '../services/product.service.js';

export const ProductController = {

    async create(req, res, next) {
        try {
            const product = await ProductService.createProduct(req.body);
            res.status(201).json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    },

    async list(req, res, next) {
        try {
            const products = await ProductService.listProducts(req.query);
            res.json({ success: true, data: products });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const product = await ProductService.updateProduct(
                req.params.id,
                req.body
            );

            res.json({ success: true, data: product });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {

        try {
            const product = await ProductService.deleteProduct(
                req.params.id
            )
            res.json({ success: true, data: product });
        } catch (error) {
            next(error)
        }
    }

};
