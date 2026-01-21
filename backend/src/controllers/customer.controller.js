import { CustomerService } from '../services/customer.service.js';

export const CustomerController = {

    async create(req, res, next) {
        try {
            const customer = await CustomerService.createCustomer(req.body);
            res.status(201).json({ success: true, data: customer });
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const customer = await CustomerService.getCustomerById(req.params.id);
            res.json({ success: true, data: customer });
        } catch (error) {
            next(error);
        }
    },

    async list(req, res, next) {
        try {
            const { q } = req.query;
            const customers = await CustomerService.listCustomers(q || '');
            res.json({ success: true, data: customers });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const customer = await CustomerService.updateCustomer(
                req.params.id,
                req.body
            );

            res.json({ success: true, data: customer });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            await CustomerService.DeleteCustomer(req.params.id);
            res.json({ success: true, message: 'Customer deleted' });
        } catch (error) {
            next(error);
        }
    }
};
