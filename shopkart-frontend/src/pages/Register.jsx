import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCustomer } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Sends both variations so backend checks pass
      const payload = {
        name: formData.name,
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        phoneNumber: formData.phone,
        contactNumber: formData.phone,
      };
      await registerCustomer(payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "3rem auto", padding: "2rem", border: "1px solid #e5e7eb", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#111827", fontSize: "1.5rem", fontWeight: "700" }}>Register Customer</h2>
      {error && <div style={{ color: "#ef4444", background: "#fee2e2", padding: "0.6rem", borderRadius: "6px", marginBottom: "1.2rem", textAlign: "center", fontSize: "0.9rem" }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{ padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "0.95rem" }} />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "0.95rem" }} />
        <input name="password" type="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} required minLength={6} style={{ padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "0.95rem" }} />
        <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required style={{ padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "0.95rem" }} />
        <button type="submit" style={{ padding: "0.85rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "1rem" }}>Register</button>
      </form>
      <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.9rem", color: "#6b7280" }}>
        Already registered? <Link to="/login" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>Login here</Link>
      </p>
    </div>
  );
}

export default Register;
