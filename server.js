import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';
import { Stripe } from 'stripe';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

import connectDB from './config/database.js';

// dotenv Config
dotenv.config();

// Connect Database
connectDB();

// Stripe Configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// Cloudinary Config
cloudinary.v2.config({
    cloud_name: process.env.CLODINARY_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_SECRET
})

// Express app
const app = express();

// MIDDLEWARES
app.use(helmet())
app.use(mongoSanitize())
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser())

// ROUTES
// Route Imports
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'


// Routes
// USER ROUTES
app.use('/user', userRoutes)

// PRODUCT ROUTES
app.use('/product', productRoutes)

// CATEGORY ROUTES
app.use('/category', categoryRoutes)

// ORDER ROUTES
app.use('/orders', orderRoutes)


// TEST
app.get('/', (req, res) => {
    res.status(200).send("<h1>Welcome to Ecommerce App</h1>")
})


// LISTEN
const PORT = process.env.PORT ||5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})