const Notification = require("../models/Notification");
const Post = require("../models/Post");
const User = require("../models/User");


// create a new post 
exports.createPost = async (req, res) => {
    try {
        const { title, content, category, country, important, image, likeCount } = req.body
        const author = req.user.id

        if (!title || !content || !category ) {
            return res.status(400).json({ message: "Title, content, category, and country are required." });
        }

        let imageUrl = image;
            if (req.file) {
            imageUrl = req.file.path; // If a file is uploaded, use its path
            }


        const newPost = new Post({
            title,
            content,
            image: imageUrl,
            category,
            country,
            important,
            likeCount: likeCount || 0,
            author
        })

        await newPost.save()

        //  constructed the URL with query parameters
        const postId = newPost._id.toString();
        const url = `/newsDetails?title=${encodeURIComponent(title)}&image=${encodeURIComponent(imageUrl)}&likes=${likeCount || 0}&content=${encodeURIComponent(content)}&postId=${postId}`;

        //  if the post is important send a notification to all users
        if (important) {
            const users = await User.find({});
            await Promise.all(users.map(user =>
                Notification.create({
                    user: user._id,
                    title,
                    message: content,
                    image: imageUrl,
                    url
                })
            ));
        }
        

        res.status(201).json({ message: "Post created successfully", post: newPost })
        
    } catch (error) {
        console.error("Create Post Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name email');
        res.json(posts);
    } catch (error) {
        console.error("Get All Posts Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name email');
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        res.json(post);
    } catch (error) {
        console.error("Get Post By ID Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// update a post
exports.updatePost = async (req, res) => {
    try {
        const { title, content, image, category, country, important } = req.body;
        const postId = req.params.id;
        const author = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Check if the user is the author of the post
        if (post.author.toString() !== author) {
            return res.status(403).json({ message: "Unauthorized access." });
        }

        post.title = title || post.title;
        post.content = content || post.content;
        post.image = image || post.image;
        post.category = category || post.category;
        post.country = country || post.country;
        post.important = important || post.important;

        await post.save();
                // If the post is updated to be important, send a notification to all users
        if (important) {
            const users = await User.find({});
            users.forEach(async (user) => {
                await Notification.create({
                    user: user._id,
                    title: "Important Post Updated",
                    message: `An important post has been updated: ${title}`,
                    url: `/posts/${post._id}`,
                });
            });
        }

        res.json({ message: "Post updated successfully", post });
    } catch (error) {
        console.error("Update Post Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const author = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Check if the user is the author of the post
        if (post.author.toString() !== author) {
            return res.status(403).json({ message: "Unauthorized access." });
        }

        // Delete post correctly
        await Post.findByIdAndDelete(postId);

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Delete Post Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// Like Post
exports.likePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Check if user has already liked the post
        if (post.likes && post.likes.includes(userId)) {
            return res.status(400).json({ message: "You have already liked this post." });
        }

        post.likes.push(userId);
        post.likeCount += 1;
        await post.save();

        res.json({ message: "Post liked successfully", likeCount: post.likeCount });
    } catch (error) {
        console.error("Like Post Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};


// Dislike Post
exports.dislikePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        // Check if user has liked the post before
        if (!post.likes || !post.likes.includes(userId)) {
            return res.status(400).json({ message: "You have not liked this post yet." });
        }

        post.likes = post.likes.filter(id => id.toString() !== userId);
        post.likeCount -= 1;
        await post.save();

        res.json({ message: "Post unliked successfully", likeCount: post.likeCount });
    } catch (error) {
        console.error("Unlike Post Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
