import { OrderService } from '../services/order.service.js';

export const OrderController = {

    async create(req, res, next) {
        try {
            const order = await OrderService.createOrder(req.body);
            res.status(201).json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const order = await OrderService.getOrderById(req.params.id);
            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    },

    async list(req, res, next) {
        try {
            const orders = await OrderService.listOrders(req.query);
            res.json({ success: true, data: orders });
        } catch (error) {
            next(error);
        }
    },

    async updateStatus(req, res, next) {
        try {
            const order = await OrderService.updateOrderStatus(
                req.params.id,
                req.body.status
            );

            res.json({ success: true, data: order });
        } catch (error) {
            next(error);
        }
    },

    async cancel(req, res, next) {
        try {
            await OrderService.cancelOrder(req.params.id);
            res.json({ success: true, message: 'Order cancelled successfully' });
        } catch (error) {
            next(error);
        }
    }
};
