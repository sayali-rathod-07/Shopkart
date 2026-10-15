import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartItem({ item }) {
  const { updateQuantity, removeFromCart, actionLoadingId } = useCart();
  const { product, quantity } = item;

  if (!product) return null;

  const isBusy = actionLoadingId === product._id;
  const itemTotal = (product.price || 0) * quantity;

  const handleDecrease = (e) => {
    e.preventDefault();
    if (quantity > 1 && !isBusy) {
      updateQuantity(product._id, quantity - 1);
    }
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    if (quantity < product.stock && !isBusy) {
      updateQuantity(product._id, quantity + 1);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr auto",
        gap: "1.25rem",
        padding: "1.25rem 0",
        borderBottom: "1px solid #e5e7eb",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#f3f4f6",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/90x90?text=No+Image";
          }}
        />
      </div>

      <div>
        <Link
          to={`/products/${product._id}`}
          style={{
            fontSize: "1.05rem",
            fontWeight: "600",
            color: "#111827",
            textDecoration: "none",
          }}
        >
          {product.name}
        </Link>
        <p
          style={{
            margin: "0.25rem 0 0.5rem 0",
            color: "#6b7280",
            fontSize: "0.85rem",
          }}
        >
          ₹{product.price?.toLocaleString("en-IN")} each
        </p>

        {product.stock <= 5 && (
          <div
            style={{
              fontSize: "0.75rem",
              color: "#dc2626",
              fontWeight: "500",
              marginBottom: "0.5rem",
            }}
          >
            Only {product.stock} units left in stock
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Quantity Controls Container */}
          <div
            style={{
              display: "flex",
              alignItems: "stretch",
              border: "1px solid #1f2937",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={handleDecrease}
              disabled={quantity <= 1 || isBusy}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: quantity <= 1 ? "#f3f4f6" : "#2563eb",
                color: quantity <= 1 ? "#9ca3af" : "#ffffff",
                border: "none",
                cursor: quantity <= 1 || isBusy ? "not-allowed" : "pointer",
                fontWeight: "900",
                fontSize: "1.2rem",
                userSelect: "none",
              }}
              title="Decrease quantity"
            >
              −
            </button>

            <div
              style={{
                minWidth: "42px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: "700",
                color: "#111827",
                backgroundColor: "#ffffff",
                borderLeft: "1px solid #e5e7eb",
                borderRight: "1px solid #e5e7eb",
              }}
            >
              {quantity}
            </div>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={quantity >= product.stock || isBusy}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: quantity >= product.stock ? "#f3f4f6" : "#2563eb",
                color: quantity >= product.stock ? "#9ca3af" : "#ffffff",
                border: "none",
                cursor: quantity >= product.stock || isBusy ? "not-allowed" : "pointer",
                fontWeight: "900",
                fontSize: "1.2rem",
                userSelect: "none",
              }}
              title="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(product._id)}
            disabled={isBusy}
            style={{
              background: "none",
              border: "none",
              color: "#dc2626",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: isBusy ? "not-allowed" : "pointer",
              padding: "0.25rem 0.5rem",
              textDecoration: "underline",
            }}
          >
            {isBusy ? "Updating..." : "Remove"}
          </button>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          ₹{itemTotal.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}

export default CartItem;
