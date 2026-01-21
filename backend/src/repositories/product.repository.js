import { Product } from '../models/product.model.js';

export const ProductRepository = {
    create(data) {
        return Product.create(data);
    },

    findById(id) {
        return Product.findById(id);
    },

    findAll() {
        return Product.find({ isDeleted: { $ne: true } });
    },

    updateById(id, data) {
        return Product.findByIdAndUpdate(id, data, { new: true });
    },
    delete(id) {
        return Product.findByIdAndUpdate(
            id,
            { isDeleted: true }
        );
    },

    decrementStock(productId, quantity, session) {
        return Product.updateOne(
            { _id: productId, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { session }
        );
    },

    incrementStock(productId, quantity, session) {
        return Product.updateOne(
            { _id: productId },
            { $inc: { stock: quantity } },
            { session }
        );
    }
};
