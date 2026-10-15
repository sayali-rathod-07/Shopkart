import Customer from "../models/customer.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shopkart_super_secret_jwt_key_2026";

export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const customer = new Customer({
      fullName,
      email,
      password,
      phone,
      wishlist: [],
    });

    await customer.save();

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: customer._id, email: customer.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || true, // Must be true for HTTPS (Render & Vercel)
      sameSite: "none", // Must be "none" across different domains
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Export as getMyProfile (and alias getCustomerProfile)
export const getMyProfile = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const customer = await Customer.findById(decoded.id).select("-password");

    if (!customer) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ success: true, customer });
  } catch (err) {
    return res.status(401).json({ message: "Invalid session" });
  }
};
export const getCustomerProfile = getMyProfile;

export const logoutCustomer = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logged out" });
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const customer = await Customer.findById(decoded.id);

    if (!customer) return res.status(404).json({ message: "User not found" });

    const isMatch = await customer.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    customer.password = newPassword;
    await customer.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
