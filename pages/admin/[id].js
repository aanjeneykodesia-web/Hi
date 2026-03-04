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

  if (!order) return <p style={{ padding: "30px" }}>Loading...</p>;

  return (
    <div style={container}>
      <h2>📄 Order Full Details</h2>

      <div style={card}>
        <p><b>Order ID:</b> {order.id}</p>
        <p><b>Shop Name:</b> {order.shopName}</p>
        <p><b>Product:</b> {order.product}</p>
        <p><b>Weight:</b> {order.weight} tons</p>

        <hr />

        <p><b>Drop Location:</b> {order.dropLat}, {order.dropLng}</p>
        <p><b>Pickup Location:</b> {order.pickupLat || "Not Set"}, {order.pickupLng || ""}</p>

        <hr />

        <p><b>Status:</b> {order.status}</p>
        <p><b>Admin Approved:</b> {order.adminApproved ? "Yes" : "No"}</p>
        <p><b>Assigned Transporter:</b> {order.assignedTo || "Not Assigned"}</p>

        <p><b>Live Location:</b> {order.currentLat || "Not Available"}, {order.currentLng || ""}</p>

        <button
          onClick={() => router.back()}
          style={backBtn}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}

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
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
};

const backBtn = {
  marginTop: "20px",
  padding: "8px 14px",
  background: "#2962ff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
