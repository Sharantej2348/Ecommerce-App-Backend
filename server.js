import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './config/database.js';

// dotenv Config
dotenv.config();

// Connect Database
connectDB();

// Express app
const app = express();

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser())

// ROUTES
// Route Imports
import userRoutes from './routes/userRoutes.js'

// Routes
app.use('/user', userRoutes)


// TEST
app.get('/', (req, res) => {
    res.status(200).send("<h1>Welcome to Ecommerce App</h1>")
})


// LISTEN
const PORT = process.env.PORT ||5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})