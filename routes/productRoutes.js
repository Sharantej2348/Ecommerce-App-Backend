import express from 'express'
import { createProductController, deleteProductController, deleteProductImageController, getAllProductsController, getSingleProductController, updateProductController, updateProductImageController } from '../controllers/productController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router()

// ROUTES
// GET ALL PRODUCTS
router.get('/get-all', getAllProductsController)

// GET SINGLE PRODUCT
router.get('/:id', getSingleProductController)

// CREATE NEW PRODUCT
router.post('/create', isAuth, singleUpload, createProductController)

// UPDATE PRODUCT
router.put('/update/:id', isAuth, updateProductController)

// UPDATE PRODUCT IMAGE
router.put('/update-image/:id', isAuth, singleUpload, updateProductImageController)

// DELETE PRODUCT IMAGE
router.delete('/delete-image/:id', isAuth, deleteProductImageController)

// DELETE PRODUCT
router.delete('/delete/:id', isAuth, deleteProductController)


export default router;