import { useState } from "react";

export default function Shopkeeper() {
  const [form, setForm] = useState({
    shopName: "",
    product: "",
    weight: "",
    dropLat: "",
    dropLng: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitOrder = async () => {
    if (!form.shopName || !form.product || !form.dropLat || !form.dropLng) {
      alert("Please fill all required fields");
      return;
    }

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        pickupLat: null,   // Manufacturer will update this
        pickupLng: null
      })
    });

    alert("Order Submitted Successfully 🚚");

    setForm({
      shopName: "",
      product: "",
      weight: "",
      dropLat: "",
      dropLng: ""
    });
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>SwiftLogix</h1>
        <p style={subtitle}>Create Logistics Order</p>

        <input
          name="shopName"
          placeholder="Shop Name"
          value={form.shopName}
          onChange={handleChange}
          style={input}
        />

        <input
          name="product"
          placeholder="Product Type"
          value={form.product}
          onChange={handleChange}
          style={input}
        />

        <input
          name="weight"
          placeholder="Weight (in tons)"
          value={form.weight}
          onChange={handleChange}
          style={input}
        />

        <h3 style={sectionTitle}>Drop Location</h3>

        <div style={row}>
          <input
            name="dropLat"
            placeholder="Drop Latitude"
            value={form.dropLat}
            onChange={handleChange}
            style={halfInput}
          />

          <input
            name="dropLng"
            placeholder="Drop Longitude"
            value={form.dropLng}
            onChange={handleChange}
            style={halfInput}
          />
        </div>

        <p style={{ fontSize: "13px", color: "#666", marginTop: "5px" }}>
          Pickup location will be updated by Manufacturer.
        </p>

        <button onClick={submitOrder} style={button}>
          Submit Order
        </button>
      </div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  padding: "20px"
};

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  width: "100%",
  maxWidth: "420px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.2)"
};

const title = {
  margin: 0,
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center"
};

const subtitle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#666"
};

const sectionTitle = {
  marginTop: "20px",
  fontSize: "16px"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "14px"
};

const halfInput = {
  width: "48%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "14px"
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px"
};

const button = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  borderRadius: "12px",
  border: "none",
  background: "#00c853",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer"
};
