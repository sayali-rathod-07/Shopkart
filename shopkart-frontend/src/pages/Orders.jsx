import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrdersApi } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrdersApi().then((res) => {
      setOrders(res.data.orders);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "4rem" }}>Loading orders...</div>;
  if (orders.length === 0) return <div style={{ textAlign: "center", padding: "4rem" }}>You have not placed any orders yet. <br/><br/><Link to="/products">Start Shopping</Link></div>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: "1.85rem", fontWeight: "700", marginBottom: "1.5rem" }}>My Orders</h1>
      {orders.map((order) => (
        <div key={order._id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "1.5rem", marginBottom: "1rem", backgroundColor: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", paddingBottom: "1rem", marginBottom: "1rem" }}>
            <div>
              <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>Order #{order._id}</p>
              <p style={{ fontWeight: "600" }}>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontWeight: "700", color: "#16a34a", fontSize: "1.1rem" }}>₹{order.totalAmount.toLocaleString("en-IN")}</p>
              <p style={{ fontSize: "0.85rem", color: "#374151", fontWeight: "600", backgroundColor: "#d1fae5", display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>{order.status}</p>
            </div>
          </div>
          {order.items.map(item => (
            <div key={item.product} style={{ marginBottom: "0.5rem" }}>
              • {item.name} × {item.quantity}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Orders;
