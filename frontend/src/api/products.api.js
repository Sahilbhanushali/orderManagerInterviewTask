import axios from './axios';

export const fetchProducts = (q = '') =>
    axios.get(`/products?q=${q}`);

export const createProduct = (data) =>
    axios.post('/products/create', data);

export const updateProduct = (id, data) =>
    axios.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
    axios.put(`/products/delete/${id}`);
