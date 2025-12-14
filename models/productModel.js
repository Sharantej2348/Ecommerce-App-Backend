import mongoose from "mongoose";

// REVIEW MODEL
const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    rating: {
        type: Number, 
        default: 0
    },
    comment: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    }
}, {timestamps: true})

// PRODUCT MODEL
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    price: {
        type: String,
        required: [true, "Price is required"]
    },
    stock: {
        type: Number,
        required: [true, "Product Qauantity is required"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    images: [{
        public_id: String,
        url: String
    }],
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number, 
        default: 0
    }
}, {timestamps: true})

const productModel = mongoose.model("Product", productSchema)
export default productModel;