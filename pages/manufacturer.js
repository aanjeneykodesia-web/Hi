import { useEffect, useState } from "react";

export default function Manufacturer() {
  const [orders, setOrders] = useState([]);
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);

  // Fetch orders
  const fetchOrders = () => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  // Auto detect GPS location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLat(position.coords.latitude);
        setCurrentLng(position.coords.longitude);
      },
      () => {
        alert("Please enable location permission");
      }
    );
  };

  useEffect(() => {
    detectLocation();
    fetchOrders();
  }, []);

  // Update pickup + approve order
  const approveOrder = async (id) => {
    if (!currentLat || !currentLng) {
      alert("Location not detected yet");
      return;
    }

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

    fetchOrders();
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Manufacturer Dashboard</h2>

      <div style={locationBox}>
        <h4>📍 Your Current Pickup Location</h4>
        <p>
          {currentLat
            ? `${currentLat.toFixed(5)}, ${currentLng.toFixed(5)}`
            : "Detecting location..."}
        </p>
        <button onClick={detectLocation} style={btnSmall}>
          Refresh Location
        </button>
      </div>

      <h3 style={{ marginTop: "30px" }}>Orders</h3>

      {orders.map(order => (
        <div key={order.id} style={card}>
          <p><b>Shop:</b> {order.shopName}</p>
          <p><b>Product:</b> {order.product}</p>
          <p><b>Weight:</b> {order.weight} tons</p>

          <p>
            <b>Drop:</b> {order.dropLat}, {order.dropLng}
          </p>

          <p>
            <b>Pickup:</b>{" "}
            {order.pickupLat
              ? `${order.pickupLat}, ${order.pickupLng}`
              : "Not Assigned"}
          </p>

          <p><b>Status:</b> {order.status}</p>

          {order.status === "Pending" && (
            <button onClick={() => approveOrder(order.id)} style={btn}>
              Approve & Set Pickup
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const locationBox = {
  background: "#e3f2fd",
  padding: "15px",
  borderRadius: "10px"
};

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
  borderRadius: "5px",
  marginTop: "10px"
};

const btnSmall = {
  padding: "6px 10px",
  background: "#00c853",
  color: "white",
  border: "none",
  borderRadius: "5px",
  marginTop: "5px"
};
