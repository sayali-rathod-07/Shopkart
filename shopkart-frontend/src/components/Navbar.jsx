import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutCustomer } from "../services/api";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

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
    <nav style={{ padding: "1rem 2rem", background: "#1f2937", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold" }}>ShopKart</h2>
      <div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            style={{ padding: "0.5rem 1rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
          >
            Logout
          </button>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ color: "#fff", textDecoration: "none" }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
