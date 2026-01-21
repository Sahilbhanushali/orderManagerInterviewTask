import { OrderItem } from '../models/order-item.model.js';

export const OrderItemRepository = {
    createMany(items, session) {
        return OrderItem.insertMany(items, { session });
    },

    findByOrderId(orderId) {
        return OrderItem.find({ orderId }).populate('productId');
    }
};
