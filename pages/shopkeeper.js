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

  const [products, setProducts] = useState([]);

  // LOAD MULTIPLE PRODUCTS
  useEffect(() => {

    const saved = localStorage.getItem("selectedProducts");

    if (saved) {

      const list = JSON.parse(saved);

      setProducts(list);

      const productString = list
        .map(p => `${p.product} - ${p.brand} - ${p.pack}`)
        .join(", ");

      setForm(prev => ({
        ...prev,
        product: productString
      }));
    }

  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // AUTO LOCATION
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

  // GENERATE INVOICE
  const generateInvoice = (order) => {

    const productList = products
      .map((p,i)=>`${i+1}. ${p.product} - ${p.brand} - ${p.pack}`)
      .join("\n");

    const text = `
SWIFTLOGIX INVOICE
-----------------------------
Invoice ID: INV-${order.id}

Shop: ${order.shopName}

Products:
${productList}

Weight: ${order.weight} tons

Drop Location:
${order.dropLat}, ${order.dropLng}

Status: Pending Admin Approval

Generated: ${new Date().toLocaleString()}
`;

    const blob = new Blob([text], { type:"text/plain" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    a.click();
  };

  const confirmSubmit = async () => {

    if (!form.shopName || !form.product) {
      alert("Fill required fields");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/orders",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify(form)
    });

    const data = await res.json();

    generateInvoice(data);

    alert("Order Created 🚚");

    localStorage.removeItem("selectedProducts");

    setLoading(false);
  };

  return (

    <div style={container}>

      <div style={card}>

        <h1>SwiftLogix</h1>

        <input
          name="shopName"
          placeholder="Shop Name"
          value={form.shopName}
          onChange={handleChange}
          style={input}
        />

        <button
          onClick={()=>router.push("/products")}
          style={productBtn}
        >
          Select Products 📦
        </button>

        <textarea
          value={form.product}
          readOnly
          style={input}
        />

        <input
          name="weight"
          placeholder="Weight (tons)"
          value={form.weight}
          onChange={handleChange}
          style={input}
        />

        <h3>Drop Location</h3>

        <input
          name="dropLat"
          placeholder="Latitude"
          value={form.dropLat}
          onChange={handleChange}
          style={input}
        />

        <input
          name="dropLng"
          placeholder="Longitude"
          value={form.dropLng}
          onChange={handleChange}
          style={input}
        />

        <button
          onClick={detectDropLocation}
          style={locationButton}
        >
          {detecting ? "Detecting..." : "📍 Use My Location"}
        </button>

        <button
          onClick={()=>setShowPopup(true)}
          style={button}
        >
          Submit Order
        </button>

      </div>

      {showPopup && (

        <div style={overlay}>

          <div style={popup}>

            <h3>Confirm Order</h3>

            <button
              onClick={confirmSubmit}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm"}
            </button>

            <button onClick={()=>setShowPopup(false)}>
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

const container={
  minHeight:"100vh",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  background:"#0f2027"
};

const card={
  background:"white",
  padding:"30px",
  borderRadius:"20px",
  width:"420px"
};

const input={
  width:"100%",
  padding:"12px",
  marginBottom:"12px"
};

const button={
  width:"100%",
  padding:"14px",
  background:"#00c853",
  color:"white",
  border:"none"
};

const locationButton={
  width:"100%",
  padding:"10px",
  background:"#2962ff",
  color:"white",
  border:"none"
};

const productBtn={
  width:"100%",
  padding:"10px",
  background:"#ff9800",
  color:"white",
  border:"none",
  marginBottom:"10px"
};

const overlay={
  position:"fixed",
  top:0,
  left:0,
  width:"100%",
  height:"100%",
  background:"rgba(0,0,0,0.6)",
  display:"flex",
  justifyContent:"center",
  alignItems:"center"
};

const popup={
  background:"white",
  padding:"20px",
  borderRadius:"10px"
};
