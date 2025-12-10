import userModel from '../models/userModels.js'
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken'
import cloudinary from 'cloudinary'
import { getDataUri } from '../utils/features.js';


// REGISTRATION
export const registerController = async(req, res) => {
    try {
        const {name, email, password, address, city, country, phone} = req.body;
        if(!name || !email || !password || !city || !address || !country || !phone){
            return res.status(500).send({
                success: false,
                message: "Please provide all fields"
            })
        }

        // Check existing User
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(500).send({
                success: false,
                message: "Email already taken"
            })
        }

        // Hashing the Password
        const saltRounds = 8;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create User
        const user = await userModel.create({name, email, password: hashedPassword, address, city, country, phone})

        res.status(201).send({
            success: true,
            message: "User registration Sucessful",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in User registration API",
            error
        })
    }
}

// LOGIN
export const loginController = async(req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).send({
                success: false,
                message: "Please provide a valid email or password"
            })
        }

        // Check User
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success: false,
                message: "User not found"
            })
        }

        // Check password
        let isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401).send({
                success: false,
                message: "Invalid Password"
            })
        }
        const signedToken = jsonwebtoken.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.status(200).cookie("token", signedToken, {
            httpOnly: process.env.NODE_ENV === "development"? true: false,
            secure: process.env.NODE_ENV === "development"? true: false,
            sameSite: process.env.NODE_ENV === "development"? true: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .send({
                success: true,
                message: "Login Successful",
                signedToken
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in User Login API", 
            error
        })
    }
}

// GET USER PROFILE
export const getProfileController = async(req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
        user.password = undefined
        res.status(200).send({
            success: true,
            message: "User Profile fetched successfully",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Get Profile API",
            error
        })
    }
}

// LOGOUT PROFILE
export const logoutController = async(req, res) => {
    try {
        res.status(200)
        .cookie("token", "", {
            httpOnly: process.env.NODE_ENV === "development"? true: false,
            secure: process.env.NODE_ENV === "development"? true: false,
            sameSite: process.env.NODE_ENV === "development"? true: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .send({
            success: true,
            message: "Logout Successful"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Logout API",
            error
        })
    }
}

// UPDATE PROFILE
export const updateProfileController = async(req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
        if(!user){
            res.status(404).send({
                success: false,
                message: "User Not found"
            })
        }
        const {name, email, address, city, country, phone} = req.body

        // Validation + Update 
        if(name) user.name = name
        if(email) user.email = email
        if(address) user.address = address
        if(city) user.city = city
        if(country) user.country = country
        if(phone) user.phone = phone

        //  Save User
        await user.save()
        res.status(200).send({
            success: true,
            message: "User Profile Updated Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Update Profile API",
            error
        })
    }
}

// UPDATE PASSWORD
export const updatePasswordController = async(req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        const {oldPassword, newPassword} = req.body

        // Validation
        if(!oldPassword || !newPassword){
            return res.status(500).send({
                success: false,
                message: "Please Provide all fields"
            })
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if(!isMatch){
            return res.status(500).send({
                success: false, 
                message: "Invald old password"
            })
        }
        
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        res.status(200).send({
            success: true,
            message: "Password Updated Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Update Password API",
            error
        })
    }
}

// UPDATE USER PROFILE PHOTO
export const updateProfilePicController = async(req, res) => {
    try {
        const user = await userModel.findById(req.user._id)

        // Get file from client
        const file = getDataUri(req.file)

        // Delete previous image
        await cloudinary.v2.uploader.destroy(user.profilePic.public_id)

        // Update
        const cloudinaryDatabase = await cloudinary.v2.uploader.upload(file.content)
        user.profilePic = {
            public_id: cloudinaryDatabase.public_id,
            url: cloudinaryDatabase.secure_url
        }

        // Save function
        await user.save()
        res.status(200).send({
            success:true,
            message: "Profile picture update successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Update Profile Picture API",
            error
        })
    }
}