import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // Assuming "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "No token provided. Access denied." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Assuming you have JWT_SECRET in .env

    // Attach decoded user to the request object
    req.user = decoded;
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: "Invalid token. Access denied." });
  }
};

export default authMiddleware;
