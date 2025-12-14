import express from 'express'
import { forgotPasswordController, getProfileController, loginController, logoutController, registerController, updatePasswordController, updateProfileController, updateProfilePicController } from '../controllers/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js';
import { rateLimit } from 'express-rate-limit'

// RATE LIMITER
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

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

// FORGOT PASSWORD
router.post('/reset-password', forgotPasswordController)

export default router;