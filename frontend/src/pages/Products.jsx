import { useEffect, useState } from 'react';
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../api/products.api';

import {
    Container,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
    IconButton,
    Box,
    Stack,
    TextField,
    InputAdornment,
    Chip,
    Card,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert
} from '@mui/material';

import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Search as SearchIcon,
    Inventory2 as ProductIcon
} from '@mui/icons-material';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const loadProducts = async (q = '') => {
        setLoading(true);
        try {
            const res = await fetchProducts(q);
            setProducts(res.data.data);
        } catch (error) {
            showSnackbar('Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);


    const handleOpenDialog = (product = null) => {
        if (product) {
            setSelectedProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                stock: product.stock
            });
        } else {
            setSelectedProduct(null);
            setFormData({
                name: '',
                price: '',
                stock: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedProduct(null);
        setFormData({
            name: '',
            price: '',
            stock: ''
        });
    };


    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            };

            if (selectedProduct) {
                await updateProduct(selectedProduct._id, payload);
                showSnackbar('Product updated successfully');
            } else {
                await createProduct(payload);
                showSnackbar('Product created successfully');
            }

            await loadProducts(searchTerm);
            handleClose();
        } catch (error) {
            showSnackbar(
                error.response?.data?.message || 'Operation failed',
                'error'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        console.log(id);

        if (!window.confirm('Delete this product?')) return;

        try {
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p._id !== id));
            showSnackbar('Product deleted');
        } catch (error) {
            showSnackbar('Delete failed', 'error');
        }
    };


    return (
        <Box sx={{ backgroundColor: '#1a1a1a', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Paper sx={{ p: 3, borderRadius: 3 }}>


                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <ProductIcon color="primary" sx={{ fontSize: 40 }} />
                            <Typography variant="h4" fontWeight={700}>
                                Product Inventory
                            </Typography>
                        </Stack>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                            Add Product
                        </Button>
                    </Box>


                    <Card sx={{ p: 2, mb: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Card>


                    <Paper>
                        {loading ? (
                            <Box p={5} textAlign="center">
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Table>
                                <TableHead sx={{ bgcolor: '#fafafa' }}>
                                    <TableRow>
                                        <TableCell><strong>Name</strong></TableCell>
                                        <TableCell><strong>Price</strong></TableCell>
                                        <TableCell><strong>Stock</strong></TableCell>
                                        <TableCell align="right"><strong>Actions</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                <Typography color="text.secondary">
                                                    No products found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.map(p => (
                                            <TableRow key={p._id} hover>
                                                <TableCell>{p.name}</TableCell>

                                                <TableCell>₹ {p.price}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={p.stock > 0 ? p.stock : 'Out of stock'}
                                                        color={p.stock > 0 ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleOpenDialog(p)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDelete(p._id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </Paper>
                </Paper>
            </Container>


            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {selectedProduct ? 'Edit Product' : 'Add Product'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Product Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                        />

                        <TextField
                            label="Price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting
                            ? 'Saving...'
                            : selectedProduct
                                ? 'Update'
                                : 'Create'}
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
