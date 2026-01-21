import express from "express";
import dotenv from "dotenv";
import customerRoutes from './routes/customer.routes.js';
import productRoutes from './routes/product.route.js';
import orderRoutes from './routes/order.routes.js';
import cors from "cors";
import { errorHandler } from './middleware/error.middleware.js';

import path from "path";
import { connectDB } from "./lib/db.js"
dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(errorHandler);
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://order-manager-interview-task-bxiivnxjb.vercel.app",
            "https://order-manager-interview-task-2ni6y5cp4.vercel.app/"
        ],
        credentials: true,
    })
);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


app.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});
