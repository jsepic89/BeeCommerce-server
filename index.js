import express, { Router } from 'express';
import mongoose from 'mongoose';
const app = express();
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import auth from './routes/auth.js';
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import cors from 'cors';

dotenv.config();

mongoose
.connect(process.env.MONGODB_URL)
.then( () => console.log("DB successfully connected"))
.catch( (error) => console.log(error));

app.use(cors());
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.listen(process.env.PORT || 4000, () => {
    console.log("Server running on port 4000")
});

