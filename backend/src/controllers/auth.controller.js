import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from '../utils/cloudinary.js';
import User from "../models/user.model.js";


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
            profileImage: newUser.profileImage,
            coverImage: newUser.coverImage
        });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
};

export const login = async (req, res) => {
    console.log("Full request:", {
        body: req.body,
        headers: req.headers,
        method: req.method
    });

    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                message: "Request body is missing",
                receivedBody: req.body,
                headers: req.headers,
                contentType: req.headers['content-type']
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide both email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage,
            coverImage: user.coverImage
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req,res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
    });

        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error"});
    }
}

export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, location, website } = req.body;
    const { profileImage, coverImage } = req.files || {};

    const updateFields = {};

    // Update basic info if provided
    if (fullName) updateFields.fullName = fullName;
    if (bio) updateFields.bio = bio;
    if (location) updateFields.location = location;
    if (website) updateFields.website = website;

    // Upload profile image if provided
    if (profileImage && profileImage[0]) {
      console.log("Uploading profile image:", profileImage[0]);
      const profileImageUrl = await uploadToCloudinary(profileImage[0].path);
      console.log("Profile image URL:", profileImageUrl);
      if (profileImageUrl) {
        updateFields.profileImage = profileImageUrl;
      }
    }

    // Upload cover image if provided
    if (coverImage && coverImage[0]) {
      console.log("Uploading cover image:", coverImage[0]);
      const coverImageUrl = await uploadToCloudinary(coverImage[0].path);
      console.log("Cover image URL:", coverImageUrl);
      if (coverImageUrl) {
        updateFields.coverImage = coverImageUrl;
      }
    }

    console.log("Update fields:", updateFields);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    console.log("Updated user:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
