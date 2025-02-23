import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        console.log("Cookies received:", req.cookies);
        const token = req.cookies.jwt;
        
        if(!token) {
            console.log("No token found in cookies");
            return res.status(401).json({message: "Unauthorized - No token"});
        }

        console.log("Token found:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            console.log("Token verification failed");
            return res.status(401).json({message: "Unauthorized - Invalid token"});
        }

        console.log("Decoded token:", decoded);
        console.log("Looking for user with ID:", decoded.userId);
        
        const user = await User.findById(decoded.userId).select("-password");
        console.log("User found:", user);

        if(!user) {
            console.log("No user found with token's userId");
            return res.status(401).json({message: "Unauthorized - User not found"});
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", {
            message: error.message,
            stack: error.stack
        });
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({message: "Invalid token"});
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({message: "Token expired"});
        }
        
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
