import axios from './axios';

export const fetchOrders = (params = {}) =>
    axios.get('/orders', { params });

export const createOrder = (payload) =>
    axios.post('/orders/create', payload);

export const cancelOrder = (orderId) =>
    axios.post(`/orders/${orderId}/cancel`);

export const updateOrderStatus = (orderId, status) =>
    axios.patch(`/orders/${orderId}/status`, { status });
