import jsonwebtoken from 'jsonwebtoken'
import userModel from '../models/userModels.js'


// USER AUTH
export const isAuth = async(req, res, next) => {
    const {token} = req.cookies;

    // validation
    if(!token){
        return res.status(401).send({
            success: false,
            message: "Unauthorized Access"
        })
    }
    const decodeData = jsonwebtoken.verify(token, process.env.JWT_SECRET)

    req.user = await userModel.findById(decodeData.id)
    next()
}


// ADMIN AUTH
export const isAdmin = async(req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(401).send({
            success: false,
            message: "Admin Only"
        })
    }
    next()
}