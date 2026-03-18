import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Shopkeeper() {
  const router = useRouter();

  const [form, setForm] = useState({
    shopName: "",
    product: "",
    Mobno: "",
    dropLat: "",
    dropLng: ""
  });

  const [products, setProducts] = useState([]);
  const [detecting, setDetecting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  // LOAD PRODUCTS
  useEffect(() => {
    const saved = localStorage.getItem("selectedProducts");

    if (saved) {
      const list = JSON.parse(saved);
      setProducts(list);

      const productString = list
        .map(p => `${p.product} - ${p.brand} - ${p.pack}`)
        .join("\n");

      setForm(prev => ({
        ...prev,
        product: productString
      }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // LOCATION
  const detectDropLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition((pos) => {
      setForm(prev => ({
        ...prev,
        dropLat: pos.coords.latitude.toFixed(6),
        dropLng: pos.coords.longitude.toFixed(6)
      }));
      setDetecting(false);
    });
  };

  // INVOICE
  const generateInvoice = (order) => {
    const productList = products
      .map((p, i) => `${i + 1}. ${p.product} - ${p.brand} - ${p.pack}`)
      .join("\n");

    const text = `
SWIFTLOGIX INVOICE
-----------------------------
Invoice ID: INV-${order.id}

Shop: ${order.shopName}

Products:
${productList}

Payment Method: ${order.paymentMethod}

Drop Location:
${order.dropLat}, ${order.dropLng}

Generated: ${new Date().toLocaleString()}
`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    a.click();
  };

  // PAYMENT + ORDER
  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("Select payment method");
      return;
    }

    if (!form.shopName || !form.product) {
      alert("Fill required fields");
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      alert(`Payment received via ${paymentMethod.toUpperCase()} ✅`);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          paymentMethod
        })
      });

      const data = await res.json();

      generateInvoice(data);

      alert("Order Created 🚚");

      localStorage.removeItem("selectedProducts");

      setLoading(false);
      setShowPopup(false);
      setPaymentMethod("");
    }, 2000);
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>SwiftLogix 🚚</h1>
        <p style={subtitle}>Create Logistics Order</p>

        <input
          name="shopName"
          placeholder="🏪 Shop Name"
          value={form.shopName}
          onChange={handleChange}
          style={input}
        />

        <button
          onClick={() => router.push("/products")}
          style={productBtn}
        >
          📦 Select Products
        </button>

        <textarea
          value={form.product}
          readOnly
          style={textarea}
        />

        <input
          name="Mobno"
          placeholder="Mobile Number"
          value={form.Mobno}
          onChange={handleChange}
          style={input}
        />

        <h3>📍 Drop Location</h3>

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
          {detecting ? "Detecting..." : "📍 Auto Detect Location"}
        </button>

        <button
          onClick={() => setShowPopup(true)}
          style={submitBtn}
        >
          🚚 Submit Order
        </button>

        <button
          onClick={() => router.push("/track")}
          style={trackBtn}
        >
          📍 Track My Orders
        </button>
      </div>

      {/* PAYMENT POPUP */}
      {showPopup && (
        <div style={overlay}>
          <div style={popup}>
            <h3>💳 Complete Payment</h3>

            <button
              onClick={() => setPaymentMethod("upi")}
              style={{
                ...methodBtn,
                background: paymentMethod === "upi" ? "#00c853" : "#eee"
              }}
            >
              📱 UPI Payment
            </button>

            <button
              onClick={() => setPaymentMethod("bank")}
              style={{
                ...methodBtn,
                background: paymentMethod === "bank" ? "#00c853" : "#eee"
              }}
            >
              🏦 Bank Transfer
            </button>

            {paymentMethod === "upi" && (
              <div style={{ marginTop: "10px" }}>
                <p>UPI ID:</p>
                <b>swiftlogix@upi</b>
              </div>
            )}

            {paymentMethod === "bank" && (
              <div style={{ marginTop: "10px", textAlign: "left" }}>
                <p><b>Account:</b> SwiftLogix Pvt Ltd</p>
                <p><b>AC No:</b> 1234567890</p>
                <p><b>IFSC:</b> SBIN0001234</p>
              </div>
            )}

            <button
              onClick={handlePayment}
              style={confirmBtn}
              disabled={loading || !paymentMethod}
            >
              {loading ? "Processing..." : "I Have Paid"}
            </button>

            <button
              onClick={() => setShowPopup(false)}
              style={cancelBtn}
            >
              Cancel
            </button>
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
  background: "linear-gradient(135deg,#141E30,#243B55)"
};

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  width: "420px"
};

const title = { textAlign: "center" };
const subtitle = { textAlign: "center", color: "#666" };

const input = { width: "100%", padding: "10px", marginBottom: "10px" };
const textarea = { width: "100%", minHeight: "60px", marginBottom: "10px" };

const row = { display: "flex", gap: "10px" };
const halfInput = { width: "50%", padding: "10px" };

const productBtn = { width: "100%", padding: "10px", background: "orange", color: "white" };
const locationButton = { width: "100%", padding: "10px", background: "blue", color: "white" };

const submitBtn = { width: "100%", padding: "12px", background: "green", color: "white" };
const trackBtn = { width: "100%", padding: "10px", background: "purple", color: "white" };

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
  padding: "20px",
  borderRadius: "10px",
  width: "300px",
  textAlign: "center"
};

const methodBtn = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const confirmBtn = {
  background: "green",
  color: "white",
  padding: "10px",
  width: "100%",
  marginTop: "10px"
};

const cancelBtn = {
  background: "red",
  color: "white",
  padding: "10px",
  width: "100%",
  marginTop: "5px"
};
