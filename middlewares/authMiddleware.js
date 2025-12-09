import jsonwebtoken from 'jsonwebtoken'
import userModel from '../models/userModels.js'

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