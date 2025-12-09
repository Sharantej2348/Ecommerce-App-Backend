import express from 'express'
import { getProfileController, loginController, logoutController, registerController } from '../controllers/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';

const router = express.Router()

// ROUTES
// REGISTER
router.post('/register', registerController)

// LOGIN
router.post('/login', loginController)

// GET PROFILE
router.get('/profile', isAuth, getProfileController)

// LOGOUT
router.get('/logout',isAuth, logoutController)

export default router;