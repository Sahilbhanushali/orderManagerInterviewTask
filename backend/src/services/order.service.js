import mongoose from 'mongoose';

import { CustomerRepository } from '../repositories/customer.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { OrderRepository } from '../repositories/order.repository.js';
import { OrderItemRepository } from '../repositories/orderItem.repository.js';

import {
    ValidationError,
    NotFoundError,
    StockError
} from '../utils/error.js';

export const OrderService = {

    async createOrder({ customerId, items }) {
        if (!items || items.length === 0) {
            throw new ValidationError('Order must contain at least one item');
        }

        const customer = await CustomerRepository.findById(customerId);
        if (!customer) {
            throw new NotFoundError('Customer not found');
        }

        let totalAmount = 0;
        const preparedItems = [];

        for (const item of items) {
            const product = await ProductRepository.findById(item.productId);
            if (!product) {
                throw new NotFoundError('Product not found');
            }

            if (product.stock < item.quantity) {
                throw new StockError(
                    `Insufficient stock for product: ${product.name}`
                );
            }

            totalAmount += product.price * item.quantity;

            preparedItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            const [order] = await OrderRepository.create(
                {
                    customerId,
                    totalAmount,
                    status: 'pending'
                },
                session
            );
            console.log(order);


            const orderItems = preparedItems.map((item) => ({
                ...item,
                orderId: order._id
            }));

            await OrderItemRepository.createMany(orderItems, session);

            for (const item of preparedItems) {
                const result = await ProductRepository.decrementStock(
                    item.productId,
                    item.quantity,
                    session
                );

                if (result.modifiedCount === 0) {
                    throw new StockError('Stock update failed due to concurrency');
                }
            }

            await session.commitTransaction();
            return order;

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    },

    async updateOrderStatus(orderId, newStatus) {
        const order = await OrderRepository.findById(orderId);
        if (!order) {
            throw new NotFoundError('Order not found');
        }

        const allowedTransitions = {
            pending: ['completed', 'cancelled'],
            completed: [],
            cancelled: []
        };

        if (!allowedTransitions[order.status].includes(newStatus)) {
            throw new ValidationError(
                `Cannot change status from ${order.status} to ${newStatus}`
            );
        }

        return OrderRepository.updateStatus(orderId, newStatus);
    },

    async cancelOrder(orderId) {
        const order = await OrderRepository.findById(orderId);
        if (!order) {
            throw new NotFoundError('Order not found');
        }

        if (order.status !== 'pending') {
            throw new ValidationError('Only pending orders can be cancelled');
        }

        const items = await OrderItemRepository.findByOrderId(orderId);

        const session = await mongoose.startSession();
        session.startTransaction();

        try {

            for (const item of items) {
                await ProductRepository.incrementStock(
                    item.productId._id,
                    item.quantity,
                    session
                );
            }

            await OrderRepository.updateStatus(orderId, 'cancelled', session);

            await session.commitTransaction();
            return { success: true };

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    },

    async listOrders(queryParams) {
        const { status, customerId, page = 1, limit = 10 } = queryParams;

        const filter = {};
        if (status) filter.status = status;
        if (customerId) filter.customerId = new mongoose.Types.ObjectId(customerId);

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const pagination = { skip, limit: parseInt(limit) };

        const [orders, total] = await Promise.all([
            OrderRepository.findAll(filter, pagination),
            OrderRepository.count(filter)
        ]);

        return {
            orders,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        };
    },
    async getOrderById(id) {
        const results = await OrderRepository.findWithDetails(
            { _id: id },
            { skip: 0, limit: 1 }
        );

        if (!results || results.length === 0) {
            throw new NotFoundError('Order not found');
        }

        return results[0];
    }


};
