import { useState } from "react";

export default function Shopkeeper() {
  const [form, setForm] = useState({
    shopName: "",
    pickup: "",
    drop: "",
    product: "",
    weight: "",
    price: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitOrder = async () => {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    alert("Order Submitted!");
    setForm({
      shopName: "",
      pickup: "",
      drop: "",
      product: "",
      weight: "",
      price: ""
    });
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Shopkeeper Dashboard</h2>

      {Object.keys(form).map(key => (
        <input
          key={key}
          name={key}
          placeholder={key}
          value={form[key]}
          onChange={handleChange}
          style={input}
        />
      ))}

      <button onClick={submitOrder} style={btn}>Submit Order</button>
    </div>
  );
}

const input = {
  display: "block",
  marginBottom: "10px",
  padding: "8px",
  width: "300px"
};

const btn = {
  padding: "10px 15px",
  background: "#00c853",
  color: "white",
  border: "none",
  borderRadius: "5px"
};
