import express from 'express'
import { isAuth } from '../middlewares/authMiddleware.js';
import { createCategoryController, deleteCategoryController, getAllCategoriesController, updateCategoryController } from '../controllers/categoryController.js';

const router = express.Router()

// CREATE CATEGORY
router.post('/create', isAuth, createCategoryController)

// GET ALL CATEGORIES
router.get('/getAll', getAllCategoriesController)

// DELETE CATEGORY
router.delete('/delete/:id', isAuth, deleteCategoryController)

// UPDATE CATEGORY
router.put('/update/:id', isAuth, updateCategoryController)

export default router;