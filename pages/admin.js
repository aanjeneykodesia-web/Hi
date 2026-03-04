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
      <h2>🛠 Admin Dashboard</h2>

      {orders.map((order) => (
        <div key={order.id} style={card}>
          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Shop:</b> {order.shopName}</p>
          <p><b>Status:</b> {order.adminApproved ? "Approved" : "Pending"}</p>

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
          </div>
        </div>
      ))}
    </div>
  );
}

const container = { padding: "30px", fontFamily: "Arial" };
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
  cursor: "pointer"
};
