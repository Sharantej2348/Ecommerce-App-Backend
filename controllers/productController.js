import productModel from "../models/productModel.js";
import cloudinary from 'cloudinary'

import { getDataUri } from "../utils/features.js";

// GET ALL PRODUCTS
export const getAllProductsController = async(req, res) => {
    try {
        const products = await productModel.find({})
        res.status(200).send({
            success: true,
            message: " All products fetched successfully ",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Get All Products API",
            error
        })
        
    }
}

// GET SINGLE PRODUCT
export const getSingleProductController = async(req, res) => {
    try {
        const productId = req.params.id
        const product = await productModel.findById(productId)
        if(!product){
            return res.status(404).send({
                success: false,
                message: "Product not found"
            })
        }
        res.status(200).send({
            success: true,
            message: "Product fetched successfully",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Get single Products API",
            error
        })
        
    }
}


// CREATE PRODUCT
export const createProductController = async(req, res) => {
    try {
        const {name, description, price, stock, category} = req.body
        if(!name || !description || !price || !stock){
            return res.status(500).send({
                success: false,
                message: "Please provide all fields"
            })
        }
        const file = getDataUri(req.file)
        if(!req.file){
            return res.status(500).send({
                success: false,
                message: "Please upload product images"
            })
        }
        const cloudinaryDatabase = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cloudinaryDatabase.public_id,
            url: cloudinaryDatabase.secure_url
        }
        await productModel.create({name, description, price, stock, category, images: [image]})
        res.status(200).send({
            success: true,
            message: "Product created successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Get All Products API",
            error
        })
        
    }
}

// UPDATE PRODUCT 
export const updateProductController = async(req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if(!product){
            return res.status(404).send({
                success: false,
                message: "Product Not Found"
            })
        }
        const {name, description, price, stock, category} = req.body
        if(name) product.name = name
        if(description) product.description = description
        if(price) product.price = price
        if(stock) product.stock = stock
        if(category) product.category = category

        await product.save()
        res.status(200).send({
            success: true, 
            messgae: "Product Detailes Updated Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Update Product API",
            error
        })
    }
}


// UPDATE PRODUCT IMAGE
export const updateProductImageController = async(req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if(!product){
            return res.status(404).send({
                success: false,
                message: "Product Not Found"
            })
        }
        const file = getDataUri(req.file)
        if(!file){
            return res.status(404).send({
                success: false,
                message: "Please Upload image"
            })
        }

        const cloudinaryDatabase = await cloudinary.v2.uploader.upload(file.content)

        const image = {
            public_id: cloudinaryDatabase.public_id,
            url: cloudinaryDatabase.secure_url
        }

        product.images.push(image)
        await product.save()
        res.status(200).send({
            success: true,
            message: "Product image Updated"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Update Product Image API",
            error
        })
    }
}

// DELETE PRODUCT IMAGE
export const deleteProductImageController = async(req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if(!product){
            return res.status(500).send({
                success: false,
                message: "Product Not Found"
            })
        }
        // Find Id of Image
        const id = req.query.id
        if(!id){
            return res.status(404).send({
                success: false,
                message: "Product Image Not Found"
            })
        }
        
        let isExist = -1;
        product.images.forEach((item, index) => {
            if(item._id.toString() === id.toString()) isExist = index
        })
        if(isExist < 0){
            return res.status(404).send({
                success: false,
                message: "Image Not Found"
            })
        }
        // Delete Product image
        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id)
        product.images.splice(isExist, 1)
        await product.save()
        res.status(200).send({
            success: true,
            message: "Product Image Deleted Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Delete Product API",
            error
        })
    }
}


// DELETE PRODUCT
export const deleteProductController = async(req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        if(!product){
            return res.status(500).send({
                success: false,
                message: "Product Not Found"
            })
        }
        // Find and delete image from cloudinary
        for(let index = 0; index < product.images.length; index++){
            await cloudinary.v2.uploader.destroy(product.images[index].public_id)
        }
        await product.deleteOne();
        res.status(200).send({
            success: true,
            message: "Product Deleted Successfully",
            
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Delete Product API",
            error
        })
    }
}