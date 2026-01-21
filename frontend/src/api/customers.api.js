import api from './axios';

export const fetchCustomers = (q = '') =>
    api.get(`/customers?q=${q}`);

export const createCustomer = (data) =>
    api.post('/customers/create', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) =>
    api.put(`/customers/delete/${id}`);