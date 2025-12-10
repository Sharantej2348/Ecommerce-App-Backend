import express from 'express'
import { getProfileController, loginController, logoutController, registerController, updatePasswordController, updateProfileController, updateProfilePicController } from '../controllers/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js';

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

// UPDATE PROFILE
router.put('/profile-update', isAuth, updateProfileController)

// UPDATE PASSWORD
router.put('/update-pass', isAuth, updatePasswordController)

// UPDATE PROFILE PIC
router.put('/update-picture', isAuth, singleUpload, updateProfilePicController)

export default router;