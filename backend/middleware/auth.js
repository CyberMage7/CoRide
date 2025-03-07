const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
    try{
        //extract token
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorization").replace("Bearer ", "");

        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }

        //verify the token
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(err) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

// import jwt from "jsonwebtoken"
// import User from "../models/User.js"

// // Protect routes
// export const protect = async (req, res, next) => {
//   let token

//   // Check if token exists in headers
//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     // Extract token from Bearer token
//     token = req.headers.authorization.split(" ")[1]
//   }

//   // Check if token exists
//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Not authorized to access this route",
//     })
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)

//     // Get user from token
//     const user = await User.findById(decoded.id)
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       })
//     }

//     // Add user to request object
//     req.user = {
//       id: user._id,
//     }

//     next()
//   } catch (error) {
//     console.error("Auth middleware error:", error)
//     return res.status(401).json({
//       success: false,
//       message: "Not authorized to access this route",
//     })
//   }
// }

