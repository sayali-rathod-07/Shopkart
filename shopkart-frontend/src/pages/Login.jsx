import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginCustomer } from "../services/api";

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginCustomer(formData);
      setIsAuthenticated(true);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem", border: "1px solid #e5e7eb", borderRadius: "8px", background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Customer Login</h2>
      {error && <div style={{ color: "#ef4444", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px" }} />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ padding: "0.6rem", border: "1px solid #ccc", borderRadius: "4px" }} />
        <button type="submit" style={{ padding: "0.75rem", background: "#10b981", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Login</button>
      </form>
      <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
