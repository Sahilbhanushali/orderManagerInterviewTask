import { CustomerRepository } from '../repositories/customer.repository.js';
import { ValidationError, NotFoundError } from '../utils/error.js';

export const CustomerService = {
    async createCustomer(data) {
        const existing = await CustomerRepository.findByEmail(data.email);
        if (existing) {
            throw new ValidationError('Customer email already exists');
        }

        return CustomerRepository.create(data);
    },

    async getCustomerById(id) {
        const customer = await CustomerRepository.findById(id);
        if (!customer) {
            throw new NotFoundError('Customer not found');
        }

        return customer;
    },

    async listCustomers(searchQuery = '') {

        return CustomerRepository.search(searchQuery);
    },

    async updateCustomer(id, data) {
        const customer = await CustomerRepository.updateById(id, data);
        if (!customer) {
            throw new NotFoundError('Customer not found');
        }

        return customer;
    },

    async DeleteCustomer(id) {
        const customer = await CustomerRepository.delete(id);
        if (!customer) {
            throw new NotFoundError('Customer not found');
        }

        return customer;
    }
};
