import express from 'express'
import { isAuth } from '../middlewares/authMiddleware.js';
import { createOrderController, getMyOrdersController, getOrderOnIdController } from '../controllers/orderController.js';

const router = express.Router()

// CREATE ORDERS
router.post('/create', isAuth, createOrderController)

// GET ALL ORDERS
router.get('/my-orders', isAuth, getMyOrdersController)

// GET SINGLE ORDER
router.get('/my-orders/:id', isAuth, getOrderOnIdController)

export default router;

