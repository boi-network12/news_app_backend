const express = require('express');
const multer = require("multer");
const authMiddleware = require('../middleware/authMiddleware');
const { createPost, getAllPosts, updatePost, deletePost, getPostById, likePost, dislikePost } = require('../controllers/PostController');

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Create a new post (protected route)
router.post('/', authMiddleware, upload.single('image'), createPost);

// Get all posts
router.get('/', getAllPosts);

// Get a single post by ID
router.get('/:id', getPostById);

// Update a post (protected route)
router.put('/:id', authMiddleware, updatePost);

// Delete a post (protected route)
router.delete('/:id', authMiddleware, deletePost);

// Like a post
router.post("/like/:postId", authMiddleware, likePost);

// Dislike a post
router.post("/dislike/:postId", authMiddleware, dislikePost);

module.exports = router;
