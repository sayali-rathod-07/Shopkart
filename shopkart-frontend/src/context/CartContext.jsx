import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCartApi,
  addToCartApi,
  updateCartQuantityApi,
  removeFromCartApi,
} from "../services/api";

const CartContext = createContext(null);

export const CartProvider = ({ children, isAuthenticated }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null); // specific item action spinner

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await getCartApi();
      setCartItems(res.data.cart || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productId) => {
    setActionLoadingId(productId);
    try {
      const res = await addToCartApi(productId);
      setCartItems(res.data.cart);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Unable to add to cart";
      return { success: false, message: msg };
    } finally {
      setActionLoadingId(null);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setActionLoadingId(productId);
    try {
      const res = await updateCartQuantityApi(productId, quantity);
      setCartItems(res.data.cart);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Unable to update quantity";
      return { success: false, message: msg };
    } finally {
      setActionLoadingId(null);
    }
  };

  const removeFromCart = async (productId) => {
    setActionLoadingId(productId);
    try {
      const res = await removeFromCartApi(productId);
      setCartItems(res.data.cart);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Unable to remove item";
      return { success: false, message: msg };
    } finally {
      setActionLoadingId(null);
    }
  };

  // Derived Values (Task 15)
  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        actionLoadingId,
        totalQuantity,
        subtotal,
        refreshCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
