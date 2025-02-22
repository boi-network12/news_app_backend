const JWT = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No valid token provided." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }

        req.user = decoded;
        const isAdmin = req.user.role === "admin";

        // Allow admin users to bypass the user ID check
        if (!isAdmin) {
            const userIdFromToken = decoded.id;
            const userIdFromParam = req.params.userId;

            if (userIdFromParam && userIdFromToken !== userIdFromParam) {
                return res.status(403).json({ message: "Unauthorized. Token does not match the user ID." });
            }
        }

        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;
