import { useEffect, useState } from "react";

export default function Transporter() {
  const [orders, setOrders] = useState([]);
  const [verifyId, setVerifyId] = useState("");

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

  const verifyDelivery = async () => {
    const order = orders.find(o => o.id.toString() === verifyId);

    if (!order) return alert("Invalid Order ID");
    if (order.status !== "In Transit")
      return alert("Order not in transit");

    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id,
        status: "Delivered"
      })
    });

    alert("Delivery Verified");
    setVerifyId("");
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Transporter Dashboard</h2>

      {orders.map(order => (
        <div key={order.id} style={card}>
          <p><b>ID:</b> {order.id}</p>
          <p><b>Status:</b> {order.status}</p>
          <p>
            <b>Live Location:</b>{" "}
            {order.currentLat
              ? `${order.currentLat.toFixed(4)}, ${order.currentLng.toFixed(4)}`
              : "Not started"}
          </p>
        </div>
      ))}

      <h3>Verify Delivery</h3>
      <input
        placeholder="Enter Order ID"
        value={verifyId}
        onChange={(e) => setVerifyId(e.target.value)}
      />
      <button onClick={verifyDelivery}>Verify</button>
    </div>
  );
}

const card = {
  padding: 15,
  marginBottom: 15,
  background: "#fff3e0",
  borderRadius: 10
};
