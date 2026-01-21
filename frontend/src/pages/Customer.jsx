import { useEffect, useState } from 'react';
import {
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
} from '../api/customers.api';

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
    Person as PersonIcon
} from '@mui/icons-material';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [open, setOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [submitting, setSubmitting] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };


    const loadCustomers = async (q = '') => {
        setLoading(true);
        try {
            const res = await fetchCustomers(q);
            setCustomers(res.data.data);
        } catch (error) {
            showSnackbar('Failed to load customers', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);


    useEffect(() => {
        const timer = setTimeout(() => {
            loadCustomers(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);


    const handleOpenDialog = (customer = null) => {
        if (customer) {
            setSelectedCustomer(customer);
            setFormData({
                name: customer.name,
                email: customer.email,
                phone: customer.phone || ''
            });
        } else {
            setSelectedCustomer(null);
            setFormData({ name: '', email: '', phone: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({ name: '', email: '', phone: '' });
        setSelectedCustomer(null);
    };


    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            if (selectedCustomer) {
                await updateCustomer(selectedCustomer._id, formData);
                showSnackbar('Customer updated successfully');
            } else {
                await createCustomer(formData);
                showSnackbar('Customer created successfully');
            }
            await loadCustomers(searchTerm);
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
        if (!window.confirm('Are you sure you want to delete this customer?')) return;

        try {
            await deleteCustomer(id);
            setCustomers(prev => prev.filter(c => c._id !== id));
            showSnackbar('Customer deleted');
        } catch (error) {
            showSnackbar('Delete failed', 'error');
        }
    };


    return (
        <Box
            sx={{
                backgroundColor: '#1a1a1a',
                minHeight: '100vh',
                py: 4
            }}
        >
            <Container maxWidth="lg">
                <Paper sx={{ p: 3, borderRadius: 3 }}>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <PersonIcon color="primary" sx={{ fontSize: 40 }} />
                            <Typography variant="h4" fontWeight={700}>
                                Customer Management
                            </Typography>
                        </Stack>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                            Add Customer
                        </Button>
                    </Box>

                    <Card sx={{ p: 2, mb: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Search customers..."
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

                    <Paper sx={{ overflow: 'hidden' }}>
                        {loading ? (
                            <Box p={5} textAlign="center">
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Table>
                                <TableHead sx={{ bgcolor: '#fafafa' }}>
                                    <TableRow>
                                        <TableCell><strong>Name</strong></TableCell>
                                        <TableCell><strong>Email</strong></TableCell>
                                        <TableCell><strong>Phone</strong></TableCell>
                                        <TableCell><strong>Status</strong></TableCell>
                                        <TableCell align="right"><strong>Actions</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                <Typography color="text.secondary">
                                                    No customers found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        customers.map(c => (
                                            <TableRow key={c._id} hover>
                                                <TableCell>{c.name}</TableCell>
                                                <TableCell>{c.email}</TableCell>
                                                <TableCell>{c.phone || '-'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={c.deletedAt ? 'Inactive' : 'Active'}
                                                        color={c.deletedAt ? 'default' : 'success'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleOpenDialog(c)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDelete(c._id)}
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
                    {selectedCustomer ? 'Edit Customer' : 'Add Customer'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                            : selectedCustomer
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
