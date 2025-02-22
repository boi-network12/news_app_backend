const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    country: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("User", UserSchema)