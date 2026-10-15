import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// Helper to return populated cart
const getPopulatedCart = async (userId) => {
  const user = await Customer.findById(userId).populate({
    path: "cart.product",
    select: "name price category image stock",
  });
  // Filter out any dangling pointers if a product was deleted
  return (user.cart || []).filter((item) => item.product !== null);
};

// POST /cart/:productId
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: "Product is out of stock" });
    }

    const user = await Customer.findById(req.user._id);
    const existingIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      const currentQty = user.cart[existingIndex].quantity;
      if (currentQty + 1 > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${product.stock} units available in stock.`,
        });
      }
      user.cart[existingIndex].quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    const updatedCart = await getPopulatedCart(user._id);

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /cart
export const getCart = async (req, res) => {
  try {
    const populatedCart = await getPopulatedCart(req.user._id);
    return res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /cart/:productId
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const newQty = Number(quantity);
    if (!newQty || isNaN(newQty) || newQty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a valid number of at least 1",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (newQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock} available)`,
      });
    }

    const user = await Customer.findById(req.user._id);
    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    user.cart[itemIndex].quantity = newQty;
    await user.save();

    const updatedCart = await getPopulatedCart(user._id);
    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /cart/:productId
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const user = await Customer.findById(req.user._id);
    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    user.cart.splice(itemIndex, 1);
    await user.save();

    const updatedCart = await getPopulatedCart(user._id);
    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
