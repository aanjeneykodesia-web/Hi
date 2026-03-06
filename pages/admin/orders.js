import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  return (
    <div style={container}>
      <h1>📊 Admin Order Dashboard</h1>

      <div style={tableContainer}>
        <table style={table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Shop</th>
              <th>Product</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Admin Approved</th>
              <th>Transporter</th>
              <th>Truck Location</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.shopName}</td>
                <td>{order.product}</td>
                <td>{order.weight}T</td>
                <td>{order.status}</td>

                <td>
                  {order.adminApproved ? "✅ Approved" : "❌ Pending"}
                </td>

                <td>
                  {order.transporterUsername
                    ? order.transporterUsername
                    : "Not Accepted"}
                </td>

                <td>
                  {order.currentLat
                    ? `${order.currentLat}, ${order.currentLng}`
                    : "Not Available"}
                </td>

                <td>
                  <button
                    style={viewBtn}
                    onClick={() => router.push(`/orders/${order.id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
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

const tableContainer = {
  overflowX: "auto",
  marginTop: "20px"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff"
};

const viewBtn = {
  padding: "6px 12px",
  background: "#2962ff",
  border: "none",
  color: "white",
  borderRadius: "5px",
  cursor: "pointer"
};
