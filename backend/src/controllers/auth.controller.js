import { generateToken } from "../lib/utils.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
    console.log("Request Body:", req.body);
    
    if (!req.body) {
        return res.status(400).json({ message: "Request body is missing" });
    }

    const {email, fullName, password} = req.body;

    if (!email || !fullName || !password) {
        return res.status(400).json({ message: "Please fill all required fields" });
    }

    try {
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        const user = await User.findOne({email})

        if (user) {
            return res.status(400).json({message: "Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        });

        await newUser.save();
        generateToken(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
};

export const login = (req,res) => {
    res.send("login router...");
}

export const logout = (req,res) => {
    res.send("logout router...");
}