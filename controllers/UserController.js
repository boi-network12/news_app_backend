const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { createNotification } = require("./NotificationController");


const adminEmail = [
    "kamdilichukwu2020@gmail.com"
]

const getLocationFromIp = async (ip) => {
    if (!ip) return "Unknown location";
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        if(!response.ok){
            throw new Error(`Error fetching location: ${response.statusText}`)
        }
        const data = await response.json();
        return data.country || "Unknown location";
    } catch (error) {
        console.error("Error fetching location:", error.message);
        return "Unknown location";
    }
}


//  Register
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Email, name and password are required. "})
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use "})
        }

        //  hash password
        const hashPassword = await bcrypt.hash(password, 10);

        //  Determine role bases on email
        const role = adminEmail.includes(email) ? "admin" : "user";

        // Get users country based on ip
        const country = await getLocationFromIp(ipAddress)


        //  create a new user
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            country,
            ipAddress,
            role,
            createdAt: new Date(),
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // send a welcome notification
        await createNotification(
            newUser._id,
            "welcome to our platform",
            `Hello ${name}, thanks for signing up.`,
            null,
            "/profile"
        )

        return res.status(200).json({
            message: "Registration successful",
            user: newUser,
            token
        });
        
        

    } catch (error) {
        console.error("Registration Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}

//  Login
exports.login = async (req, res) => {
    try {
        const { email, password} = req.body;
        const ipAddress = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Update user's latest IP and country
        user.ipAddress = ipAddress;
        user.country = await getLocationFromIp(ipAddress);
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Send a login alert notification
        await createNotification(
            user._id,
            "New Login Detected",
            `Your account was accessed from ${user.country}`,
            null,
            "/profile"
        );

        res.json({ 
            message: "Login successful", 
            token, 
            user: { id: user._id, name: user.name, email: user.email, country: user.country, role: user.role } 
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}

//  Fetch User info
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (error) {
        console.error("Fetch User Info Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

// Delete User Account
exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ message: "Account deleted successfully." });
    } catch (error) {
        console.error("Delete Account Error:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};