import React, { useState, useEffect } from "react";
import { fetchProducts, getWishlistApi } from "../services/api";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

function Products() {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getWishlistApi()
      .then((res) => {
        const ids = new Set((res.data.wishlist || []).map((item) => item._id));
        setWishlistIds(ids);
      })
      .catch(() => {
        setWishlistIds(new Set());
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");

    fetchProducts(search, category)
      .then((res) => {
        setProducts(res.data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load products");
        setLoading(false);
      });
  }, [search, category]);

  const handleWishlistChange = (productId, isAdded) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (isAdded) {
        next.add(productId);
      } else {
        next.delete(productId);
      }
      return next;
    });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "1.85rem", fontWeight: "700", color: "#111827", marginBottom: "1.5rem" }}>
        Product Catalog
      </h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      {loading && (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#6b7280" }}>
          Loading products...
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            padding: "1rem",
            borderRadius: "8px",
            textAlign: "center",
            margin: "2rem 0",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "#9ca3af" }}>
          No products found matching your search.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              initialWishlisted={wishlistIds.has(product._id)}
              onWishlistChange={handleWishlistChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
