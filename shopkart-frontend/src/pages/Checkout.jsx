import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createPaymentOrderApi, verifyPaymentApi } from "../services/api";

function Checkout() {
  const { cartItems, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!formData.phone.match(/^[0-9]{10}$/)) return setError("Phone must be 10 digits");
    if (!formData.pincode.match(/^[0-9]{6}$/)) return setError("Pincode must be 6 digits");
    
    setLoading(true);
    setError("");

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setLoading(false);
      return setError("Failed to load Razorpay SDK. Check your connection.");
    }

    try {
      // 1. Create Order on Backend
      const { data } = await createPaymentOrderApi({ shippingAddress: formData });

      // 2. Open Razorpay Checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "Complete your purchase",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            // 3. Verify Signature
            await verifyPaymentApi({
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await refreshCart();
            navigate(`/order-success/${data.shopKartOrderId}`);
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone,
        },
        theme: { color: "#2563eb" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (res) => setError("Payment failed. Please try again."));
      paymentObject.open();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to initiate checkout");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return <div style={{ textAlign: "center", padding: "4rem" }}>Your cart is empty.</div>;

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "1.85rem", fontWeight: "700", marginBottom: "1.5rem" }}>Checkout</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <form onSubmit={handlePayment} style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Shipping Details</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <input required name="fullName" placeholder="Full Name" onChange={handleChange} style={{ padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "6px" }} />
            <input required name="phone" placeholder="Phone Number" onChange={handleChange} style={{ padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "6px" }} />
          </div>
          <input required name="addressLine1" placeholder="Address Line" onChange={handleChange} style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "6px", marginBottom: "1rem" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <input required name="city" placeholder="City" onChange={handleChange} style={{ padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "6px" }} />
            <input required name="state" placeholder="State" onChange={handleChange} style={{ padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "6px" }} />
            <input required name="pincode" placeholder="Pincode" onChange={handleChange} style={{ padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "6px" }} />
          </div>

          {error && <div style={{ color: "#dc2626", marginBottom: "1rem", fontSize: "0.9rem" }}>{error}</div>}
          
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "1rem", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Processing..." : "Place Order & Pay"}
          </button>
        </form>

        <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "10px", border: "1px solid #e5e7eb", height: "fit-content" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.product._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span>{item.product.name} × {item.quantity}</span>
              <span style={{ fontWeight: "600" }}>₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <hr style={{ margin: "1rem 0", borderTop: "1px solid #e5e7eb" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: "700", color: "#16a34a" }}>
            <span>Total</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
