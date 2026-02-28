import { useEffect, useState, useRef } from "react";

export default function Transporter() {
  const [orders, setOrders] = useState([]);
  const [verifyId, setVerifyId] = useState("");
  const activeIntervals = useRef({});

  // Fetch all orders
  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  // START DELIVERY WITH LIVE MOVEMENT
  const startDelivery = async (order) => {
    if (!order.pickupLat || !order.dropLat) {
      alert("Pickup or Drop coordinates missing");
      return;
    }

    if (activeIntervals.current[order.id]) return;

    let currentLat = parseFloat(order.pickupLat);
    let currentLng = parseFloat(order.pickupLng);
    const dropLat = parseFloat(order.dropLat);
    const dropLng = parseFloat(order.dropLng);

    // Mark as In Transit
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

    const moveInterval = setInterval(async () => {
      currentLat += (dropLat - currentLat) * 0.15;
      currentLng += (dropLng - currentLng) * 0.15;

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

      // Stop when reached
      if (distance < 0.0005) {
        clearInterval(moveInterval);
        delete activeIntervals.current[order.id];
      }
    }, 3000);

    activeIntervals.current[order.id] = moveInterval;
  };

  // VERIFY DELIVERY
  const verifyDelivery = async () => {
    const order = orders.find(
      (o) => o.id.toString() === verifyId.trim()
    );

    if (!order) {
      alert("Invalid Order ID");
      return;
    }

    if (order.status !== "In Transit") {
      alert("Order must be In Transit");
      return;
    }

    // Stop movement if still running
    if (activeIntervals.current[order.id]) {
      clearInterval(activeIntervals.current[order.id]);
      delete activeIntervals.current[order.id];
    }

    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id,
        status: "Delivered"
      })
    });

    alert("Delivery Verified Successfully ✅");
    setVerifyId("");
  };

  return (
    <div style={container}>
      <h2 style={{ marginBottom: 20 }}>🚚 Transporter Dashboard</h2>

      {orders.length === 0 && <p>No orders available</p>}

      {orders.map((order) => (
        <div key={order.id} style={card}>
          {/* ORDER ID HIDDEN */}

          <p><b>Status:</b> {order.status}</p>

          <p>
            <b>Route:</b>{" "}
            {order.pickupLat || "Not set"},{" "}
            {order.pickupLng || ""} →{" "}
            {order.dropLat || "Not set"},{" "}
            {order.dropLng || ""}
          </p>

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

      {/* DELIVERY VERIFICATION SECTION */}
      <div style={{ marginTop: 40 }}>
        <h3>🔐 Verify Delivery</h3>

        <input
          type="text"
          placeholder="Enter Order ID"
          value={verifyId}
          onChange={(e) => setVerifyId(e.target.value)}
          style={input}
        />

        <button style={button} onClick={verifyDelivery}>
          Verify
        </button>
      </div>
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
  cursor: "pointer",
  marginRight: 10
};

const input = {
  padding: 8,
  marginRight: 10,
  borderRadius: 6,
  border: "1px solid #ccc"
};
