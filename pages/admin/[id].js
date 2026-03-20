import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function OrderDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      const res = await fetch("/api/orders");
      const data = await res.json();
      const found = data.find(o => o.id == id);
      setOrder(found);
    };

    fetchOrder();
  }, [id]);

  if (!order) return <p style={{ padding: "30px" }}>Loading order details...</p>;

  return (
    <div style={container}>
      <h2>📦 Order Full Details</h2>

      <div style={card}>

        {/* BASIC DETAILS */}
        <h3>Order Info</h3>
        <p><b>Order ID:</b> {order.id}</p>
        <p><b>Shop Name:</b> {order.shopName}</p>
        <p><b>Product:</b> {order.product}</p>
        <p><b>Mobno:</b> {order.Mobno} </p>

        <hr />

        {/* LOCATION DETAILS */}
        <h3>Location Details</h3>
        <p>
          <b>Drop Location:</b> {order.dropLat}, {order.dropLng}
        </p>

        <p>
          <b>Pickup Location:</b>{" "}
          {order.pickupLat
            ? `${order.pickupLat}, ${order.pickupLng}`
            : "Not Set Yet"}
        </p>

        <hr />

        {/* ORDER STATUS */}
        <h3>Status</h3>
        <p><b>Order Status:</b> {order.status}</p>
        <p><b>Admin Approved:</b> {order.adminApproved ? "✅ Yes" : "❌ No"}</p>

        <hr />

        {/* TRANSPORTER DETAILS */}
        <h3>Transporter Details</h3>

        <p>
          <b>Accepted By:</b>{" "}
          {order.transporterUsername
            ? order.transporterUsername
            : "Not Accepted Yet"}
        </p>

        <p>
          <b>Transporter ID:</b>{" "}
          {order.assignedTo ? order.assignedTo : "Not Assigned"}
        </p>

        <p>
          <b>Current Truck Location:</b>{" "}
          {order.currentLat
            ? `${order.currentLat}, ${order.currentLng}`
            : "Not Available"}
        </p>

        <hr />

        <button onClick={() => router.back()} style={backBtn}>
          ⬅ Back
        </button>

      </div>
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

const card = {
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  maxWidth: "600px"
};

const backBtn = {
  marginTop: "20px",
  padding: "10px 16px",
  background: "#2962ff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
