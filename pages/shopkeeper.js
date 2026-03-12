import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Shopkeeper() {

  const router = useRouter();

  const [form, setForm] = useState({
    shopName: "",
    product: "",
    weight: "",
    dropLat: "",
    dropLng: ""
  });

  const [detecting, setDetecting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  // AUTO FILL PRODUCT FROM PRODUCTS PAGE
  useEffect(() => {

    const saved = localStorage.getItem("selectedProduct");

    if (saved) {
      const product = JSON.parse(saved);

      setForm((prev) => ({
        ...prev,
        product: `${product.product} - ${product.brand} - ${product.pack}`
      }));
    }

  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // AUTO DETECT LOCATION
  const detectDropLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {

        setForm((prev) => ({
          ...prev,
          dropLat: position.coords.latitude.toFixed(6),
          dropLng: position.coords.longitude.toFixed(6)
        }));

        setDetecting(false);

      },
      () => {
        alert("Enable location permission");
        setDetecting(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // GENERATE INVOICE
  const generateInvoice = (order) => {

    const invoiceText = `
SWIFTLOGIX INVOICE
--------------------------------
Invoice ID: INV-${order.id}
Shop Name: ${order.shopName}
Product: ${order.product}
Weight: ${order.weight} tons
Drop Location: ${order.dropLat}, ${order.dropLng}
Status: Pending Admin Approval
--------------------------------
Generated On: ${new Date().toLocaleString()}
`;

    const blob = new Blob([invoiceText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_INV-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };

  // FINAL SUBMIT
  const confirmSubmit = async () => {

    if (!form.shopName || !form.product || !form.dropLat || !form.dropLng) {
      alert("Please fill all required fields");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      generateInvoice(data);

      alert("Order Submitted Successfully 🚚");

      setForm({
        shopName: "",
        product: "",
        weight: "",
        dropLat: "",
        dropLng: ""
      });

      setShowPopup(false);
      setLoading(false);

    } catch (error) {

      alert("Something went wrong");
      setLoading(false);

    }

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

        {/* PRODUCT FIELD */}

        <input
          name="product"
          placeholder="Product Type"
          value={form.product}
          onChange={handleChange}
          style={input}
        />

        <button
          onClick={() => router.push("/products")}
          style={productBtn}
        >
          View Products 📦
        </button>

        <input
          name="weight"
          placeholder="Weight (tons)"
          value={form.weight}
          onChange={handleChange}
          style={input}
        />

        <h3>Drop Location</h3>

        <div style={row}>

          <input
            name="dropLat"
            placeholder="Latitude"
            value={form.dropLat}
            onChange={handleChange}
            style={halfInput}
          />

          <input
            name="dropLng"
            placeholder="Longitude"
            value={form.dropLng}
            onChange={handleChange}
            style={halfInput}
          />

        </div>

        <button onClick={detectDropLocation} style={locationButton}>
          {detecting ? "Detecting..." : "📍 Use My Location"}
        </button>

        <button
          onClick={() => setShowPopup(true)}
          style={button}
        >
          Submit Order
        </button>

      </div>

      {/* POPUP */}

      {showPopup && (
        <div style={overlay}>

          <div style={popup}>

            <h3>Confirm Order</h3>
            <p>Invoice will be generated automatically.</p>

            <div style={{ marginTop: "20px" }}>

              <button
                onClick={confirmSubmit}
                style={confirmBtn}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>

              <button
                onClick={() => setShowPopup(false)}
                style={cancelBtn}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* STYLES */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
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
  textAlign: "center",
  fontSize: "28px",
  fontWeight: "bold"
};

const subtitle = {
  textAlign: "center",
  color: "#666",
  marginBottom: "20px"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd"
};

const halfInput = {
  width: "48%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd"
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

const locationButton = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#2962ff",
  color: "white",
  marginTop: "10px"
};

const productBtn = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#ff9800",
  color: "white",
  marginBottom: "10px",
  cursor: "pointer"
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const popup = {
  background: "white",
  padding: "25px",
  borderRadius: "15px",
  width: "300px",
  textAlign: "center"
};

const confirmBtn = {
  background: "#00c853",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  marginRight: "10px",
  cursor: "pointer"
};

const cancelBtn = {
  background: "#ff5252",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer"
};
