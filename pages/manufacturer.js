import { useEffect, useState } from "react";

export default function Manufacturer() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const approveOrder = async (id) => {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "Approved" })
    });

    fetchOrders();
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Manufacturer Dashboard</h2>

      {orders.map(order => (
        <div key={order.id} style={card}>
          <p><b>Shop:</b> {order.shopName}</p>
          <p><b>Route:</b> {order.pickup} → {order.drop}</p>
          <p><b>Product:</b> {order.product}</p>
          <p><b>Price:</b> ₹{order.price}</p>
          <p><b>Status:</b> {order.status}</p>

          {order.status === "Pending" && (
            <button onClick={() => approveOrder(order.id)} style={btn}>
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "#f1f1f1",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "8px"
};

const btn = {
  padding: "8px 12px",
  background: "#2962ff",
  color: "white",
  border: "none",
  borderRadius: "5px"
};
