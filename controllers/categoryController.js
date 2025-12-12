import mongoose from "mongoose";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const createCategoryController = async(req, res) => {
    try {
        const {category} = req.body
        if(!category){
            return res.status(404).send({
                success: false,
                message: "Please provide category"
            })
        }
        await categoryModel.create({category})
        res.status(201).send({
            success: true,
            message: `${category} created Successfully`
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false, 
            message: "Error in Category Create API"
        })
        
    }
}

// GET ALL CATEGORIES
export const getAllCategoriesController = async(req, res) => {
    try {
        const categories = await categoryModel.find({})
        res.status(201).send({
            success: true,
            message: "All Products fetched Successfully",
            TotalCategories : categories.length, 
            categories
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false, 
            message: "Error in Get All Categories API"
        })
    }
}

// DELETE CATEGORY
export const deleteCategoryController = async(req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)
        if(!category){
            return res.status(404).send({
                success: false,
                message: "category Not Found"
            })
        }
        // Find Producst with this id
        const products = await productModel.find({category: category._id})
        // Update Product Categor
        for (let i=0; i<products.length; i++){
            const product = products[i]
            product.category = undefinded
            await product.save()
        }
        // Save
        await categoryModel.deleteOne()
        res.status(201).send({
            success: true,
            message: "Category Deleted Successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false, 
            message: "Error in Delete Category API"
        })
    }
}

// UPDATE CATEGORY 
export const updateCategoryController = async(req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)
        if(!category){
            return res.status(404).send({
                success: false,
                message: "category Not Found"
            })
        }
        // Get New category
        const {updatedCategory} = req.body
        // Find Producst with this id
        const products = await productModel.find({category: category._id})
        // Update Product Categor
        for (let i=0; i<products.length; i++){
            const product = products[i]
            product.category = updatedCategory
            await product.save()
        }

        if(updatedCategory) category.category = updatedCategory;
        // Save
        await category.save()
        res.status(201).send({
            success: true,
            message: "Category Updated Successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false, 
            message: "Error in Update Category API"
        })
    }
}