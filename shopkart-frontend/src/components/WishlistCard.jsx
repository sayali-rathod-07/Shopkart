import React from "react";
import { Link } from "react-router-dom";

function WishlistCard({ product, onRemove }) {
  if (!product) return null;

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
      <div style={{ height: "180px", overflow: "hidden", backgroundColor: "#f3f4f6" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
          }}
        />
      </div>

      <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
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
            fontSize: "1.05rem",
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
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "#16a34a" }}>
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            <span
              style={{
                fontSize: "0.8rem",
                color: product.stock > 0 ? "#4b5563" : "#dc2626",
                fontWeight: "500",
              }}
            >
              {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
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
              View
            </Link>

            <button
              type="button"
              onClick={() => onRemove(product._id)}
              style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                border: "1px solid #fecaca",
                padding: "0.55rem 0.5rem",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Remove ♥
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;
