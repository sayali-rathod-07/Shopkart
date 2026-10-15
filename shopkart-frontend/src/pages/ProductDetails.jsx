import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../services/api";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetchProductById(id)
      .then((res) => {
        setProduct(res.data.product);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Product fetch failed:", err);
        setError(
          err.response?.status === 404
            ? "Product not found."
            : "Something went wrong while loading product details."
        );
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem", color: "#6b7280", fontSize: "1.1rem" }}>
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "500px", margin: "3rem auto", padding: "1.5rem", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", textAlign: "center" }}>
        <p style={{ margin: "0 0 1rem 0" }}>{error}</p>
        <Link to="/products" style={{ color: "#2563eb", fontWeight: "600" }}>
          &larr; Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div style={{ maxWidth: "1000px", margin: "2.5rem auto", padding: "0 1.5rem" }}>
      <Link
        to="/products"
        style={{
          display: "inline-block",
          marginBottom: "1.5rem",
          color: "#2563eb",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        &larr; Back to Products
      </Link>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2.5rem",
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#f9fafb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "450px",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x350?text=No+Image";
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              textTransform: "uppercase",
              fontSize: "0.8rem",
              fontWeight: "700",
              color: "#6b7280",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            {product.category}
          </span>

          <h1 style={{ fontSize: "1.85rem", fontWeight: "700", color: "#111827", marginBottom: "0.75rem" }}>
            {product.name}
          </h1>

          <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#16a34a", marginBottom: "1rem" }}>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </div>

          <p style={{ color: "#4b5563", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            {product.description}
          </p>

          <div style={{ marginBottom: "2rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.3rem 0.8rem",
                borderRadius: "9999px",
                fontSize: "0.85rem",
                fontWeight: "600",
                backgroundColor: product.stock > 0 ? "#dcfce7" : "#fee2e2",
                color: product.stock > 0 ? "#15803d" : "#b91c1c",
              }}
            >
              {product.stock > 0 ? `${product.stock} units available in stock` : "Currently Out of Stock"}
            </span>
          </div>

          <button
            type="button"
            disabled={product.stock <= 0}
            style={{
              padding: "0.9rem 1.5rem",
              backgroundColor: product.stock > 0 ? "#2563eb" : "#9ca3af",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: product.stock > 0 ? "pointer" : "not-allowed",
              marginTop: "auto",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
