import { useEffect, useState } from "react";

export default function Transporter() {
  const [orders, setOrders] = useState([]);

  // Fetch all orders
  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  const startDelivery = async (order) => {
    let currentLat = parseFloat(order.pickupLat);
    let currentLng = parseFloat(order.pickupLng);

    const dropLat = parseFloat(order.dropLat);
    const dropLng = parseFloat(order.dropLng);

    // Mark In Transit
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id,
        status: "In Transit",
        transporter: "Transporter A",
        currentLat,
        currentLng
      })
    });

    // Start movement simulation
    const interval = setInterval(async () => {
      currentLat += (dropLat - currentLat) * 0.1;
      currentLng += (dropLng - currentLng) * 0.1;

      const distance =
        Math.abs(dropLat - currentLat) +
        Math.abs(dropLng - currentLng);

      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          currentLat,
          currentLng
        })
      });

      if (distance < 0.0005) {
        clearInterval(interval);

        await fetch("/api/orders", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: order.id,
            status: "Delivered"
          })
        });
      }
    }, 3000);
  };

  return (
    <div style={container}>
      <h2 style={{ marginBottom: 20 }}>🚚 Transporter Dashboard</h2>

      {orders.length === 0 && <p>No orders available</p>}

      {orders.map(order => (
        <div key={order.id} style={card}>
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Status:</b> {order.status}</p>
          <p><b>Route:</b> {order.pickupLat}, {order.pickupLng} → {order.dropLat}, {order.dropLng}</p>

          <p>
            <b>Current Location:</b>{" "}
            {order.currentLat
              ? `${order.currentLat.toFixed(4)}, ${order.currentLng.toFixed(4)}`
              : "Not started"}
          </p>

          {order.status === "Approved" && (
            <button style={button} onClick={() => startDelivery(order)}>
              Start Delivery
            </button>
          )}

          {order.status === "In Transit" && (
            <p style={{ color: "orange" }}>🚛 On the way...</p>
          )}

          {order.status === "Delivered" && (
            <p style={{ color: "green" }}>✅ Delivered</p>
          )}
        </div>
      ))}
    </div>
  );
}

const container = {
  padding: 30,
  background: "#f5f7fa",
  minHeight: "100vh"
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 10,
  marginBottom: 15,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

const button = {
  padding: "8px 15px",
  background: "#111",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};
