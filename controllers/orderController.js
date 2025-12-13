import mongoose from "mongoose";
import orderModel  from '../models/orderModel.js'
import productModel from "../models/productModel.js";
import { stripe } from "../server.js";

export const createOrderController = async(req, res) => {
    try {
        const {shippingInfo, orderItems, paymentMethod, paymentInfo, itemPrice, tax, shippingCharges, totalAmount} = req.body;
        // Create Order
        await orderModel.create({ user: req.user._id, shippingInfo, orderItems, paymentMethod, paymentInfo, itemPrice, tax, shippingCharges, totalAmount})

        // Stock update
        for(let i=0; i<orderItems.length; i++){
            // find Product
            const product = await productModel.findById(orderItems[i].product)
            product.stock -= orderItems[i].quantity
            await product.save()
        }
        res.status(201).send({
            success: true,
            message: "Order placed Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Create Order API",
            error
        })
    }
}


// GET ALL ORDERS - MY ORDERRS
export const getMyOrdersController = async(req, res) => {
    try {
        // Find orders
        const orders = await orderModel.find({user: req.user._id})
        if(!orders){
            return res.status(404).send({
                success: false,
                message: "No orders found"
            })
        }
        res.status(200).send({
            success: true,
            message: "Your Orders",
            totalOrders: orders.length,
            orders
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in My Orders API",
            error
        })
    }
}

// GET SINGLE ORDER BASED ON ID
export const getOrderOnIdController = async(req, res) => {
    try {
        // Find orders
        const order = await orderModel.findById(req.params.id)
        if(!order){
            return res.status(404).send({
                success: false,
                message: "Order Not Found"
            })
        }
        res.status(200).send({
            success: true,
            message: "Your Order Details",
            order
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Get Order By Id API",
            error
        })
    }
}


// ACCEPT PATMENTS THROUGH STRIPE
export const paymentsController = async(req, res) => {
    try {
        // Get amount
        const {totalAmount} = req.body;
        if(!totalAmount){
            return res.status(404).send({
                success: false,
                message: "Please enter Total Amount"
            })
        }
        const {client_secret} = await stripe.paymentIntents.create({
            amount: Number(totalAmount),
            currency: 'inr'
        })
        res.status(200).send({
            success: true,
            message: "Payment Successful",
            client_secret
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Payments API",
            error
        })
    }
}


// GET ALL ORDERS _ADMIN
export const getAllOrdersController = async(req, res) => {
    try {
        const orders = await orderModel({})
        res.status(200).send({
            success: true,
            message: "All orders fetched Successfully",
            totalOrders: orders.length,
            orders
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Get All Orders API - Admin",
            error
        })
    }
}

// CHANGE ORDER STATUS -ADMIN
export const changeOrderStatusController = async(req, res) => {
    try {
        const order = await orderModel.findById(req.params.id)
        if(!order){
            return res.status(404).send({
                success: false, 
                message: "Order Not Found"
            })
        }
        if(order.orderStatus === "Processing"){
            order.orderStatus = "Shipped"
        }
        else if(order.orderStatus === "Shipped"){
            order.orderStatus = "Delivered"
            order.deliveredAt = Date.now()
        }else{
            return res.status(500).send({
                success: false,
                message: "Order Already Delivered"
            })
        }
        await order.save()
        res.status(200).send({
            success: true, 
            message: "Order Status Updated"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Change Order Status - Admin",
            error
        })
    }
}