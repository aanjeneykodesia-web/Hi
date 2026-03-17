import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const approveOrder = async (id) => {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    fetchOrders();
  };

  return (
    <div style={container}>
      <div style={headerRow}>
        <h2>🛠 Admin Dashboard</h2>

        <button
          onClick={() => router.push("/products")}
          style={updateProductsBtn}
        >
          Update Products
        </button>
      </div>
  <button
  onClick={() => {
    localStorage.setItem("role", "admin");
    alert("You are now Admin ✅");
    window.location.reload();
  }}
  style={{
    padding: "10px 15px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: "8px",
    marginBottom: "10px"
  }}
>
  Enable Admin Mode
</button>

      {orders.map((order) => (
        <div key={order.id} style={card}>
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Shop:</b> {order.shopName}</p>

          <p>
            <b>Status:</b>{" "}
            {order.adminApproved ? "Approved" : "Pending"}
          </p>

          <p>
            <b>Truck Location:</b>{" "}
            {order.currentLat
              ? `${order.currentLat.toFixed(5)}, ${order.currentLng.toFixed(5)}`
              : "Not started"}
          </p>

          <div style={{ marginTop: "10px" }}>
            {!order.adminApproved && (
              <button
                onClick={() => approveOrder(order.id)}
                style={approveBtn}
              >
                Approve
              </button>
            )}

            <button
              onClick={() => router.push(`/admin/${order.id}`)}
              style={viewBtn}
            >
              View Details
            </button>

            {order.currentLat && (
              <a
                href={`https://www.google.com/maps?q=${order.currentLat},${order.currentLng}`}
                target="_blank"
                rel="noreferrer"
                style={trackBtn}
              >
                Track Truck 📍
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const container = {
  padding: "30px",
  fontFamily: "Arial",
  background: "#f5f7fa",
  minHeight: "100vh"
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const updateProductsBtn = {
  background: "#111827",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

const card = {
  background: "#fff",
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

const approveBtn = {
  background: "#00c853",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  marginRight: "10px",
  cursor: "pointer"
};

const viewBtn = {
  background: "#2962ff",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "10px"
};

const trackBtn = {
  background: "#ff9800",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  textDecoration: "none",
  cursor: "pointer"
};
