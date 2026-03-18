import { useEffect, useState } from "react";

export default function Manufacturer() {
  const [orders, setOrders] = useState([]);
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Fetch ONLY admin approved orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();

      // 🔥 FILTER ONLY ADMIN APPROVED
      const approvedOrders = data.filter(
        (order) => order.adminApproved === true
      );

      setOrders(approvedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Detect GPS location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLat(position.coords.latitude);
        setCurrentLng(position.coords.longitude);
        setLoadingLocation(false);
      },
      () => {
        alert("Please enable location permission");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    detectLocation();
    fetchOrders();
  }, []);

  // Approve order & set pickup
  const approveOrder = async (id) => {
    if (currentLat === null || currentLng === null) {
      alert("Location not detected yet");
      return;
    }

    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: "Approved",
          pickupLat: currentLat,
          pickupLng: currentLng
        })
      });

      alert("Pickup location updated successfully ✅");
      fetchOrders();
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order");
    }
  };

  return (
    <div style={container}>
      <h2>🏭 Manufacturer Dashboard</h2>

      {/* LOCATION BOX */}
      <div style={locationBox}>
        <h4>📍 Your Current Pickup Location</h4>

        <p>
          {loadingLocation
            ? "Detecting location..."
            : currentLat !== null
            ? `${currentLat.toFixed(5)}, ${currentLng.toFixed(5)}`
            : "Location not detected"}
        </p>

        <button onClick={detectLocation} style={btnSmall}>
          Refresh Location
        </button>
      </div>

      <h3 style={{ marginTop: "30px" }}>Admin Approved Orders</h3>

      {orders.length === 0 && (
        <p>No admin-approved orders available</p>
      )}

      {orders.map((order) => (
        <div key={order.id} style={card}>
          <p><b>Shop:</b> {order.shopName}</p>
          <p><b>Product:</b> {order.product}</p>
          <p><b>Mobno:</b> {order.Mobno} </p>

          <p>
            <b>Drop:</b>{" "}
            {order.dropLat && order.dropLng
              ? `${order.dropLat}, ${order.dropLng}`
              : "Not Set"}
          </p>

          <p>
            <b>Pickup:</b>{" "}
            {order.pickupLat
              ? `${order.pickupLat}, ${order.pickupLng}`
              : "Not Assigned"}
          </p>

          <p><b>Status:</b> {order.status}</p>

          {/* 🔥 Only allow manufacturer approval if still Pending */}
          {order.status === "Pending" && (
            <button
              onClick={() => approveOrder(order.id)}
              style={btn}
            >
              Approve & Set Pickup
            </button>
          )}

          {order.status === "Approved" && (
            <p style={{ color: "green", fontWeight: "bold" }}>
              Pickup Assigned ✅
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* STYLES */

const container = {
  padding: "30px",
  fontFamily: "Arial",
  background: "#f5f7fa",
  minHeight: "100vh"
};

const locationBox = {
  background: "#e3f2fd",
  padding: "15px",
  borderRadius: "10px"
};

const card = {
  background: "#ffffff",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "8px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

const btn = {
  padding: "8px 12px",
  background: "#2962ff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  marginTop: "10px",
  cursor: "pointer"
};

const btnSmall = {
  padding: "6px 10px",
  background: "#00c853",
  color: "white",
  border: "none",
  borderRadius: "5px",
  marginTop: "5px",
  cursor: "pointer"
};
