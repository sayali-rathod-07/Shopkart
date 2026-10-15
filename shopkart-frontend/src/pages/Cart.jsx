import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

function Cart() {
  const { cartItems, loading, error, totalQuantity, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 0", color: "#6b7280", fontSize: "1.1rem" }}>
        Loading your cart...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem", maxWidth: "450px", margin: "3rem auto" }}>
        <h2 style={{ color: "#dc2626", marginBottom: "0.5rem" }}>Unable to load your cart.</h2>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>{error}</p>
        <button
          onClick={refreshCart}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "5rem 1.5rem",
          maxWidth: "500px",
          margin: "3rem auto",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
          Your cart is empty
        </h2>
        <p style={{ color: "#6b7280", lineHeight: "1.5", marginBottom: "1.75rem" }}>
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to="/products"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.75rem",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: "600",
            borderRadius: "8px",
          }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "1.85rem", fontWeight: "700", color: "#111827", marginBottom: "1.5rem" }}>
        My Cart
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2.5rem", alignItems: "start" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            padding: "1.5rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
          }}
        >
          {cartItems.map((item) => (
            <CartItem key={item.product?._id || item._id} item={item} />
          ))}
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            padding: "1.5rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginBottom: "1.25rem" }}>
            Order Summary
          </h2>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", color: "#4b5563" }}>
            <span>Total Units</span>
            <span style={{ fontWeight: "600", color: "#111827" }}>{totalQuantity}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", color: "#4b5563" }}>
            <span>Subtotal</span>
            <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#16a34a" }}>
              ₹{subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "1.25rem 0" }} />

          <button
            onClick={() => navigate("/checkout")}
            style={{
              width: "100%",
              padding: "0.85rem",
              backgroundColor: "#10b981",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
