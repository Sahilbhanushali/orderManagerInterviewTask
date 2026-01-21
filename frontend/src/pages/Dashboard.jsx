import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Stack
} from '@mui/material';

import {
    People as CustomersIcon,
    Inventory as ProductsIcon,
    ShoppingCart as OrdersIcon
} from '@mui/icons-material';

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#1a1a1a',
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Container maxWidth="md">
                <Paper sx={{ p: 5, borderRadius: 3 }}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        textAlign="center"
                        mb={4}
                    >
                        Order Management System
                    </Typography>

                    <Stack spacing={3}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<CustomersIcon />}
                            onClick={() => navigate('/customers')}
                            sx={{ py: 1.5 }}
                        >
                            Manage Customers
                        </Button>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ProductsIcon />}
                            onClick={() => navigate('/products')}
                            sx={{ py: 1.5 }}
                        >
                            Manage Products
                        </Button>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<OrdersIcon />}
                            onClick={() => navigate('/orders')}
                            sx={{ py: 1.5 }}
                        >
                            Manage Orders
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
