import React from "react";
import { useParams, Link } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();

  return (
    <div style={{ maxWidth: "600px", margin: "4rem auto", textAlign: "center", padding: "2rem", backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", marginBottom: "0.5rem" }}>Order Placed Successfully</h1>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>Order ID: {id}</p>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Link to="/orders" style={{ padding: "0.75rem 1.5rem", backgroundColor: "#2563eb", color: "#fff", textDecoration: "none", borderRadius: "6px", fontWeight: "600" }}>View My Orders</Link>
        <Link to="/products" style={{ padding: "0.75rem 1.5rem", backgroundColor: "#f3f4f6", color: "#1f2937", textDecoration: "none", borderRadius: "6px", fontWeight: "600" }}>Continue Shopping</Link>
      </div>
    </div>
  );
}

export default OrderDetails;
