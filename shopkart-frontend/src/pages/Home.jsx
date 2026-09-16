import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerProfile } from "../services/api";

function Home({ setIsAuthenticated }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCustomerProfile()
      .then((res) => {
        console.log("Customer Profile Response:", res.data);
        // Extracts data regardless of backend key structure
        const userData =
          res.data.customer ||
          res.data.data ||
          res.data.user ||
          res.data;
        setProfile(userData);
        setIsAuthenticated(true);
      })
      .catch((err) => {
        console.error("Profile fetch failed:", err);
        setError("Failed to load profile. Please log in again.");
        setIsAuthenticated(false);
        setTimeout(() => navigate("/login"), 1500);
      });
  }, [navigate, setIsAuthenticated]);

  if (error) {
    return (
      <div style={{ maxWidth: "450px", margin: "3rem auto", padding: "1.5rem", background: "#fee2e2", color: "#b91c1c", borderRadius: "8px", textAlign: "center" }}>
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem", color: "#9ca3af", fontSize: "1.1rem" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "520px", margin: "3rem auto", padding: "2rem", background: "#ffffff", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", color: "#1f2937" }}>
      <h2 style={{ fontSize: "1.6rem", fontWeight: "700", marginBottom: "1.25rem", color: "#111827", textAlign: "center" }}>
        Welcome, {profile.name || profile.fullName || "Customer"}!
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "1rem", lineHeight: "1.6", borderTop: "1px solid #f3f4f6", paddingTop: "1.25rem" }}>
        <p><strong>Email:</strong> {profile.email || "N/A"}</p>
        <p><strong>Phone:</strong> {profile.phone || profile.phoneNumber || profile.contactNumber || "N/A"}</p>
        <p><strong>User ID:</strong> <span style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#4b5563" }}>{profile._id || profile.id || "N/A"}</span></p>
      </div>
    </div>
  );
}

export default Home;
