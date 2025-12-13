import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "Address is required"]
        },
        city: {
            type: String,
            required: [true, "City is required"]
        },
        country: {
            type: String,
            required: [true, "Country is required"]
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, "Product name is required"]
            },
            price: {
                type: Number,
                required: [true, "Price is required"]
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required"]
            },
            image: {
                type: String,
                required: [true, "Product Image is required"]
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            }
        },
        
    ],
    paymentMethod: {
        type: String,
        enum: ["COD", "ONLINE"],
        default: "COD"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required"]
    },
    paidAt: Date,
    paymentInfo: {
        id: String,
        status: String
    },
    itemPrice: {
        type: Number,
        required: [true, "Item price is required"]
    },
    tax: {
        type: Number,
        required: [true, "Tax price is required"]
    },
    shippingCharges: {
        type: Number,
        required: [true, "Shipping Charges are required"]
    },
    totalAmount: {
        type: Number,
        required: [true, "Item total amount is required"]
    },
    orderStatus: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered'],
        default: 'Processing'
    },
    deliveredAt: Date
}, {timestamps: true})

const Order = mongoose.model("Order", orderSchema)
export default Order;