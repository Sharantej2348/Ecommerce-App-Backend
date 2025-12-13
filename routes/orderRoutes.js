import express from 'express'
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js';
import { changeOrderStatusController, createOrderController, getAllOrdersController, getMyOrdersController, getOrderOnIdController, paymentsController } from '../controllers/orderController.js';

const router = express.Router()

// CREATE ORDERS -USER
router.post('/create', isAuth, createOrderController)

// GET ALL ORDERS -USER
router.get('/my-orders', isAuth, getMyOrdersController)

// GET SINGLE ORDER - USER
router.get('/my-orders/:id', isAuth, getOrderOnIdController)

// ACCEPT PAYMENT THROUGH STRIPE
router.post('/payments', isAuth, paymentsController)

// GET ALL ORDERS - ADMIN
router.get('/admin/get-all-orders', isAuth, isAdmin, getAllOrdersController) 

// CHANGE ORDER STATUS - ADMIN
router.put('/admin/order/:id', isAuth, isAdmin, changeOrderStatusController)

export default router;

