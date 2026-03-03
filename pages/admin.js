import { useEffect, useState } from "react";

export default function Admin() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const approveOrder = async (id) => {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    fetchOrders();
  };

  const rejectOrder = async (id) => {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: "Rejected"
      })
    });

    fetchOrders();
  };

  return (
    <div style={container}>
      <h2>🛠 Admin Dashboard</h2>

      {orders.length === 0 && <p>No Orders Found</p>}

      {orders.map((order) => (
        <div key={order.id} style={card}>
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Shop:</b> {order.shopName}</p>
          <p><b>Product:</b> {order.product}</p>
          <p><b>Weight:</b> {order.weight} tons</p>
          <p>
            <b>Drop Location:</b> {order.dropLat}, {order.dropLng}
          </p>

          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                color:
                  order.status === "Rejected"
                    ? "red"
                    : order.adminApproved
                    ? "green"
                    : "orange"
              }}
            >
              {order.status === "Rejected"
                ? "Rejected"
                : order.adminApproved
                ? "Approved"
                : "Pending Approval"}
            </span>
          </p>

          {/* Buttons */}
          {!order.adminApproved && order.status !== "Rejected" && (
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => approveOrder(order.id)}
                style={approveBtn}
              >
                Approve
              </button>

              <button
                onClick={() => rejectOrder(order.id)}
                style={rejectBtn}
              >
                Reject
              </button>
            </div>
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
  background: "#f4f6f9",
  minHeight: "100vh"
};

const card = {
  background: "#ffffff",
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
};

const approveBtn = {
  padding: "8px 12px",
  marginRight: "10px",
  background: "#00c853",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const rejectBtn = {
  padding: "8px 12px",
  background: "#ff5252",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
