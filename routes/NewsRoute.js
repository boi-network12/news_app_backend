const express = require("express");
const rateLimit = require("express-rate-limit");
const Post = require("../models/Post");

const router = express.Router();

//  Rate limiting: preview excessive request (max 100 per 15 minutes);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too much requests, please try again later",
});



router.get("/", limiter, async (req, res) => {
    try {
        const posts = await Post.find()
        .select("title content category country createdAt likeCount")
        .sort({ createdAt : -1 })
        .limit(10)

        res.json(posts)
    } catch (error) {
        console.error("Public API Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
})


module.exports = router;