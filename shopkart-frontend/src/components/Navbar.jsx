import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutCustomer } from "../services/api";
import { useCart } from "../context/CartContext";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const { totalQuantity } = useCart();

  const handleLogout = async () => {
    try {
      await logoutCustomer();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  return (
    <nav
      style={{
        padding: "1rem 2rem",
        background: "#1f2937",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link to="/products" style={{ color: "#fff", textDecoration: "none", fontSize: "1.3rem", fontWeight: "bold" }}>
          ShopKart
        </Link>
        <Link to="/products" style={{ color: "#d1d5db", textDecoration: "none", fontSize: "0.95rem" }}>
          Products
        </Link>
        <Link to="/wishlist" style={{ color: "#d1d5db", textDecoration: "none", fontSize: "0.95rem" }}>
          Wishlist
        </Link>
        {isAuthenticated && (
          <Link to="/orders" style={{ color: "#d1d5db", textDecoration: "none", fontSize: "0.95rem" }}>
            Orders
          </Link>
        )}
        <Link
          to="/cart"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontSize: "0.95rem",
            fontWeight: "600",
            backgroundColor: "#374151",
            padding: "0.35rem 0.75rem",
            borderRadius: "6px",
          }}
        >
          Cart ({totalQuantity})
        </Link>
      </div>

      <div>
        {isAuthenticated ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link to="/home" style={{ color: "#d1d5db", textDecoration: "none" }}>
              Profile
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.45rem 0.9rem",
                background: "#ef4444",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "#fff", textDecoration: "none" }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
