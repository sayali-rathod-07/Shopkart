import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addToWishlistApi, removeFromWishlistApi } from "../services/api";
import { useCart } from "../context/CartContext";

function ProductCard({ product, initialWishlisted = false, onWishlistChange }) {
  const [wishlistState, setWishlistState] = useState(
    initialWishlisted ? "added" : "default"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { cartItems, addToCart, actionLoadingId } = useCart();

  const cartItem = cartItems?.find(
    (item) => (item.product?._id || item.product) === product._id
  );
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isAddingToCart = actionLoadingId === product._id;

  useEffect(() => {
    setWishlistState(initialWishlisted ? "added" : "default");
  }, [initialWishlisted]);

  const handleToggleWishlist = async () => {
    if (wishlistState === "saving") return;
    setErrorMessage("");

    if (wishlistState === "added") {
      setWishlistState("saving");
      try {
        await removeFromWishlistApi(product._id);
        setWishlistState("default");
        if (onWishlistChange) onWishlistChange(product._id, false);
      } catch (err) {
        setErrorMessage("Could not remove item.");
        setWishlistState("added");
      }
    } else {
      setWishlistState("saving");
      try {
        await addToWishlistApi(product._id);
        setWishlistState("added");
        if (onWishlistChange) onWishlistChange(product._id, true);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else if (err.response?.status === 409) {
          setWishlistState("added");
        } else {
          setErrorMessage("Unable to save product.");
        }
        setWishlistState("default");
      }
    }
  };

  const handleAddToCart = async () => {
    setErrorMessage("");
    const res = await addToCart(product._id);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          height: "200px",
          overflow: "hidden",
          backgroundColor: "#f3f4f6",
          position: "relative",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
        <button
          onClick={handleToggleWishlist}
          disabled={wishlistState === "saving"}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #e5e7eb",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: wishlistState === "saving" ? "not-allowed" : "pointer",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: wishlistState === "added" ? "#ef4444" : "#4b5563",
          }}
          title={
            wishlistState === "added"
              ? "Remove from Wishlist"
              : "Save to Wishlist"
          }
        >
          {wishlistState === "added" ? "♥" : "♡"}
        </button>
      </div>

      <div
        style={{
          padding: "1.2rem",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            fontWeight: "700",
            color: "#6b7280",
            letterSpacing: "0.05em",
            marginBottom: "0.4rem",
          }}
        >
          {product.category}
        </span>

        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "0.5rem",
            lineHeight: "1.4",
          }}
        >
          {product.name}
        </h3>

        <div style={{ marginTop: "auto", paddingTop: "0.8rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.75rem",
            }}
          >
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "#16a34a",
              }}
            >
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            <span
              style={{
                fontSize: "0.85rem",
                color: product.stock > 0 ? "#4b5563" : "#dc2626",
                fontWeight: "500",
              }}
            >
              {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
            </span>
          </div>

          {errorMessage && (
            <div
              style={{
                color: "#dc2626",
                fontSize: "0.8rem",
                marginBottom: "0.5rem",
                textAlign: "center",
              }}
            >
              {errorMessage}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <Link
              to={`/products/${product._id}`}
              style={{
                textAlign: "center",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "0.55rem 0.5rem",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "0.85rem",
              }}
            >
              Details
            </Link>

            <button
              type="button"
              onClick={handleToggleWishlist}
              disabled={wishlistState === "saving"}
              style={{
                backgroundColor:
                  wishlistState === "added" ? "#fee2e2" : "#f3f4f6",
                color: wishlistState === "added" ? "#ef4444" : "#1f2937",
                border: "1px solid #d1d5db",
                padding: "0.55rem 0.5rem",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "0.85rem",
                cursor: wishlistState === "saving" ? "not-allowed" : "pointer",
              }}
            >
              {wishlistState === "saving"
                ? "⏳..."
                : wishlistState === "added"
                ? "♥ Saved"
                : "♡ Wishlist"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock <= 0}
            style={{
              width: "100%",
              padding: "0.6rem",
              backgroundColor:
                product.stock <= 0
                  ? "#9ca3af"
                  : quantityInCart > 0
                  ? "#059669"
                  : "#10b981",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "0.85rem",
              cursor:
                isAddingToCart || product.stock <= 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isAddingToCart
              ? "Updating..."
              : product.stock <= 0
              ? "Out of Stock"
              : quantityInCart > 0
              ? `In Cart (${quantityInCart}) — Add More +`
              : "Add to Cart 🛒"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
