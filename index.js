const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');
const authRoutes = require("./routes/userRoutes.js")
const notificationRoutes = require("./routes/NotificationRoutes.js")
const postRoutes = require("./routes/postRoutes.js")
const newsRoutes = require("./routes/NewsRoute.js")

dotenv.config();

const app = express();


connectDB();

app.use(cors({
    origin: [
        "*", 
        "https://news-web-wine.vercel.app",
        "http://localhost:3000"
        ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// routes (example)
app.use('/auth', authRoutes)
app.use('/', notificationRoutes)
app.use('/posts', postRoutes);
app.use("/api/news", newsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
