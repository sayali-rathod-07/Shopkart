import jwt from "jsonwebtoken";
import Customer from "../models/customer.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authenticated. Please log in." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "shopkart_super_secret_jwt_key_2026");
    const user = await Customer.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "User not found in DB. Please register/login again." });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired or invalid. Please log in again." });
  }
};
