import mongoose from "mongoose";

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
    // quantity: {
    //     type: Number,
    //     required: [true, "Stock is required"]
    // },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    images: [{
        public_id: String,
        url: String
    }]
}, {timestamps: true})

const productModel = mongoose.model("Product", productSchema)
export default productModel;