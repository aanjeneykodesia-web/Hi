import { useEffect, useState } from "react";

export default function Shopkeeper() {

  const [form, setForm] = useState({
    shopName: "",
    Mobno: ""
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ PRICE LIST (can be made dynamic later)
  const priceList = {
    "Cooking Oil": {
      "1L": 150,
      "5L": 700,
      "15L": 2000
    },
    "Rice": {
      "5kg": 300,
      "10kg": 550,
      "25kg": 1300
    },
    "Sugar": {
      "1kg": 50,
      "5kg": 240,
      "10kg": 480
    }
  };

  // ✅ LOAD PRODUCTS + RAZORPAY SCRIPT
  useEffect(() => {
    const savedProducts = localStorage.getItem("selectedProducts");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ✅ INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ TOTAL CALCULATION
  const calculateTotal = () => {
    let total = 0;

    products.forEach((item) => {
      const price = priceList[item.product]?.[item.pack] || 0;
      total += price * (item.quantity || 1);
    });

    return total;
  };

  // ✅ REMOVE PRODUCT (extra useful)
  const removeProduct = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
    localStorage.setItem("selectedProducts", JSON.stringify(updated));
  };

  // ✅ GENERATE INVOICE (simple)
  const generateInvoice = (order) => {
    let text = `Invoice\n\nShop: ${order.shopName}\nMobile: ${order.Mobno}\n\n`;

    products.forEach((p) => {
      text += `${p.product} - ${p.brand} - ${p.pack} x ${p.quantity}\n`;
    });

    text += `\nTotal: ₹${order.totalAmount}`;

    console.log(text);
  };

  // ✅ PAYMENT + ORDER
  const confirmSubmit = async () => {

    if (!form.shopName || products.length === 0) {
      alert("Fill details & select products");
      return;
    }

    const totalAmount = calculateTotal();

    setLoading(true);

    try {
      // 🔹 Create Razorpay order
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: totalAmount })
      });

      const order = await res.json();

      // 🔹 Razorpay popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "SwiftLogix",
        description: `Payment ₹${totalAmount}`,
        order_id: order.id,

        handler: async function () {

          // 🔹 Create order AFTER payment
          const res2 = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...form,
              products,
              totalAmount
            })
          });

          const data = await res2.json();

          generateInvoice(data);

          alert(`✅ Payment Successful ₹${totalAmount}`);

          localStorage.removeItem("selectedProducts");
          setProducts([]);
          setForm({ shopName: "", Mobno: "" });
          setLoading(false);
        },

        prefill: {
          name: form.shopName,
          contact: form.Mobno
        },

        theme: {
          color: "#16a34a"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("Payment failed");
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h1>🚚 Shopkeeper Dashboard</h1>

      <input
        name="shopName"
        placeholder="Shop Name"
        value={form.shopName}
        onChange={handleChange}
        style={input}
      />

      <input
        name="Mobno"
        placeholder="Mobile Number"
        value={form.Mobno}
        onChange={handleChange}
        style={input}
      />

      <h3>Selected Products</h3>

      {products.length === 0 ? (
        <p>No products selected</p>
      ) : (
        products.map((p, i) => (
          <div key={i} style={productBox}>
            {p.product} - {p.brand} - {p.pack} x {p.quantity}

            <button
              onClick={() => removeProduct(i)}
              style={removeBtn}
            >
              ❌
            </button>
          </div>
        ))
      )}

      <h2>Total: ₹{calculateTotal()}</h2>

      <button
        onClick={confirmSubmit}
        style={button}
        disabled={loading}
      >
        {loading ? "Processing..." : "Confirm & Pay"}
      </button>
    </div>
  );
}

// 🎨 STYLES
const container = {
  padding: "30px",
  maxWidth: "600px",
  margin: "auto",
  fontFamily: "Arial"
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const button = {
  padding: "12px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  width: "100%",
  cursor: "pointer",
  borderRadius: "6px",
  fontWeight: "bold"
};

const productBox = {
  padding: "10px",
  background: "#f3f4f6",
  marginBottom: "8px",
  borderRadius: "6px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const removeBtn = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: "5px 8px",
  cursor: "pointer",
  borderRadius: "4px"
};
