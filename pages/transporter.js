import { useEffect, useState, useRef } from "react";

export default function Transporter() {
  const [orders, setOrders] = useState([]);
  const [verifyId, setVerifyId] = useState("");
  const [verifyOrder, setVerifyOrder] = useState(null); // popup control
  const activeIntervals = useRef({});

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

  // CHECK IF ANY ORDER IS ACTIVE
  const isOrderActive = () => {
    return orders.some((o) => o.status === "In Transit");
  };

  // START DELIVERY
  const startDelivery = async (order) => {
    if (isOrderActive()) {
      alert("You can only deliver one order at a time!");
      return;
    }

    if (!order.pickupLat || !order.dropLat) {
      alert("Pickup or Drop coordinates missing");
      return;
    }

    let currentLat = parseFloat(order.pickupLat);
    let currentLng = parseFloat(order.pickupLng);
    const dropLat = parseFloat(order.dropLat);
    const dropLng = parseFloat(order.dropLng);

    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id,
        status: "In Transit",
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

      // ARRIVED AT DESTINATION
      if (distance < 0.0005) {
        clearInterval(moveInterval);
        delete activeIntervals.current[order.id];

        // Mark ready for verification popup
        setVerifyOrder(order);
      }
    }, 3000);

    activeIntervals.current[order.id] = moveInterval;
  };

  // VERIFY POPUP CONFIRMATION
  const confirmDelivery = async () => {
    if (!verifyOrder) return;

    if (verifyId.trim() !== verifyOrder.id.toString()) {
      alert("Incorrect Order ID!");
      return;
    }

    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: verifyOrder.id,
        status: "Delivered"
      })
    });

    alert("Delivery Completed Successfully ✅");

    setVerifyOrder(null);
    setVerifyId("");
  };

  return (
    <div style={container}>
      <h2>🚚 Transporter Dashboard</h2>

      {orders.map((order) => (
        <div key={order.id} style={card}>
          <p><b>Status:</b> {order.status}</p>

          <p>
            <b>Route:</b> {order.pickupLat}, {order.pickupLng} →{" "}
            {order.dropLat}, {order.dropLng}
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
            <p style={{ color: "orange" }}>🚛 Delivering...</p>
          )}

          {order.status === "Delivered" && (
            <p style={{ color: "green" }}>✅ Delivered</p>
          )}
        </div>
      ))}

      {/* VERIFICATION POPUP */}
      {verifyOrder && (
        <div style={popupOverlay}>
          <div style={popup}>
            <h3>🔐 Confirm Delivery</h3>
            <p>Enter Order ID to confirm delivery:</p>

            <input
              type="text"
              value={verifyId}
              onChange={(e) => setVerifyId(e.target.value)}
              style={input}
              placeholder="Enter Order ID"
            />

            <button style={button} onClick={confirmDelivery}>
              Confirm
            </button>
          </div>
        </div>
      )}
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
  marginTop: 10
};

const input = {
  padding: 8,
  borderRadius: 6,
  border: "1px solid #ccc",
  marginTop: 10,
  width: "100%"
};

const popupOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const popup = {
  background: "white",
  padding: 30,
  borderRadius: 10,
  width: 300,
  textAlign: "center"
};
