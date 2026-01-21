import { ProductRepository } from '../repositories/product.repository.js';
import { NotFoundError, ValidationError } from '../utils/error.js';

export const ProductService = {
    async createProduct(data) {
        return ProductRepository.create(data);
    },

    async getProductById(id) {
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        return product;
    },

    async listProducts() {
        return ProductRepository.findAll();
    },

    async updateProduct(id, data) {

        if (!data) {
            throw new ValidationError('Update data is required');
        }
        if (data.stock !== undefined && data.stock < 0) {
            throw new ValidationError('Stock cannot be negative');
        }

        const product = await ProductRepository.updateById(id, data);
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        return product;
    },

    async deleteProduct(id) {
        const product = await ProductRepository.delete(id);

        if (!product) {
            throw new NotFoundError('Product not found');
        }

        return product;
    }
};
