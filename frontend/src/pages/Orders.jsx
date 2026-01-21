import { useEffect, useState } from 'react';
import {
    fetchOrders,
    createOrder,
    cancelOrder,
    updateOrderStatus
} from '../api/orders.api';
import { fetchCustomers } from '../api/customers.api';
import { fetchProducts } from '../api/products.api';

import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack,
    Chip,
    Snackbar,
    Alert,
    Pagination
} from '@mui/material';

import {
    Add as AddIcon,
    ShoppingCart as OrderIcon
} from '@mui/icons-material';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    const [open, setOpen] = useState(false);
    const [customerId, setCustomerId] = useState('');
    const [items, setItems] = useState([]);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };


    const loadData = async () => {
        try {

            const [o, c, p] = await Promise.all([
                fetchOrders({ page, limit }),
                fetchCustomers(),
                fetchProducts()
            ]);

            setOrders(o.data.data.orders);
            setTotalPages(o.data.data.pagination.pages || 1);

            setCustomers(c.data.data);
            setProducts(p.data.data);
        } catch (error) {
            showSnackbar('Failed to load data', 'error');
        }
    };

    useEffect(() => {
        loadData();
    }, [page]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            showSnackbar('Status updated successfully');
            loadData();
        } catch (error) {
            showSnackbar(
                error.response?.data?.message || 'Failed to update status',
                'error'
            );
        }
    };


    const openDialog = () => {
        setCustomerId('');
        setItems([]);
        setOpen(true);
    };

    const closeDialog = () => setOpen(false);



    const addItem = () => {
        setItems([...items, { productId: '', quantity: 1 }]);
    };

    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const totalAmount = items.reduce((sum, item) => {
        const product = products.find(p => p._id === item.productId);
        return product ? sum + product.price * item.quantity : sum;
    }, 0);


    const handleSubmit = async () => {
        if (!customerId || items.length === 0) {
            showSnackbar('Customer and items required', 'error');
            return;
        }

        try {
            await createOrder({
                customerId,
                items
            });

            showSnackbar('Order created successfully');
            closeDialog();
            setPage(1);
            loadData();
        } catch (error) {
            showSnackbar(
                error.response?.data?.message || 'Order creation failed',
                'error'
            );
        }
    };


    const handleCancel = async (orderId) => {
        if (!window.confirm('Cancel this order?')) return;

        try {
            await cancelOrder(orderId);
            showSnackbar('Order cancelled');
            loadData();
        } catch {
            showSnackbar('Cancellation failed', 'error');
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box sx={{ backgroundColor: '#1a1a1a', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Paper sx={{ p: 3, borderRadius: 3 }}>


                    <Box display="flex" justifyContent="space-between" mb={4}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <OrderIcon color="primary" sx={{ fontSize: 40 }} />
                            <Typography variant="h4" fontWeight={700}>
                                Orders
                            </Typography>
                        </Stack>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={openDialog}
                        >
                            New Order
                        </Button>
                    </Box>


                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Customer</TableCell>
                                <TableCell>Items</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order._id} hover>
                                    <TableCell>
                                        {order.customer?.name || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {order.items.length}
                                    </TableCell>
                                    <TableCell>
                                        {order.productDetails && order.productDetails[0]?.name || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        ₹ {order.totalAmount}
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            select
                                            size="small"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            sx={{ minWidth: 120 }}
                                            disabled={order.status === 'cancelled' || order.status === 'completed'}
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        {order.status === 'pending' && (
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => handleCancel(order._id)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                        />
                    </Box>

                </Paper>
            </Container>

            <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="md">
                <DialogTitle>Create Order</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            select
                            label="Customer"
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            fullWidth
                        >
                            {customers.map(c => (
                                <MenuItem key={c._id} value={c._id}>
                                    {c.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        {items.map((item, index) => (
                            <Paper key={index} sx={{ p: 2 }}>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        select
                                        label="Product"
                                        value={item.productId}
                                        onChange={(e) =>
                                            updateItem(index, 'productId', e.target.value)
                                        }
                                        fullWidth
                                    >
                                        {products.map(p => (
                                            <MenuItem key={p._id} value={p._id}>
                                                {p.name} (Stock: {p.stock})
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        type="number"
                                        label="Qty"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateItem(index, 'quantity', Number(e.target.value))
                                        }
                                        inputProps={{ min: 1 }}
                                        sx={{ width: 120 }}
                                    />

                                    <Button
                                        color="error"
                                        onClick={() => removeItem(index)}
                                    >
                                        Remove
                                    </Button>
                                </Stack>
                            </Paper>
                        ))}

                        <Button onClick={addItem}>Add Item</Button>
                        <Typography variant="h6">
                            Total: ₹ {totalAmount}
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Place Order
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}