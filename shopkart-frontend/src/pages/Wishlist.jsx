import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWishlistApi, removeFromWishlistApi } from "../services/api";
import WishlistCard from "../components/WishlistCard";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlist = () => {
    setLoading(true);
    setError("");
    getWishlistApi()
      .then((res) => {
        setWishlist(res.data.wishlist || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Wishlist load error:", err);
        setError("We couldn't load your wishlist.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlistApi(productId);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      alert("Failed to remove product from wishlist. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 0", color: "#6b7280", fontSize: "1.1rem" }}>
        Loading your wishlist...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1rem", maxWidth: "450px", margin: "3rem auto" }}>
        <h2 style={{ color: "#dc2626", marginBottom: "0.5rem" }}>Something went wrong.</h2>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>{error}</p>
        <button
          onClick={loadWishlist}
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

  if (wishlist.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "5rem 1.5rem",
          maxWidth: "500px",
          margin: "2rem auto",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❤️</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>
          Your wishlist is empty
        </h2>
        <p style={{ color: "#6b7280", lineHeight: "1.5", marginBottom: "1.75rem" }}>
          Save products you love and find them here later.
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
    <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.85rem", fontWeight: "700", color: "#111827", marginBottom: "0.25rem" }}>
          My Wishlist
        </h1>
        <p style={{ color: "#6b7280", margin: 0 }}>
          {wishlist.length} {wishlist.length === 1 ? "product" : "products"} saved
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {wishlist.map((product) => (
          <WishlistCard key={product._id} product={product} onRemove={handleRemove} />
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
