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

  const [detecting, setDetecting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // ✅ PRICE LIST
  const priceList = {
    "Cooking Oil": { "1L": 150, "5L": 700, "15L": 2000 },
    "Rice": { "5kg": 300, "10kg": 550, "25kg": 1300 },
    "Sugar": { "1kg": 50, "5kg": 240, "10kg": 480 }
  };

  // LOAD SELECTED PRODUCTS
  useEffect(() => {

    const saved = localStorage.getItem("selectedProducts");

    if (saved) {
      const list = JSON.parse(saved);
      setProducts(list);

      const productString = list
        .map(p => `${p.product} - ${p.brand} - ${p.pack} x ${p.quantity}`)
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

  // ✅ TOTAL CALCULATION
  const calculateTotal = () => {
    let total = 0;

    products.forEach((p) => {
      const price = priceList[p.product]?.[p.pack] || 0;
      total += price * (p.quantity || 1);
    });

    return total;
  };

  // 📍 LOCATION DETECT
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

  // 🧾 INVOICE
  const generateInvoice = (order) => {

    const productList = products
      .map((p,i)=>`${i+1}. ${p.product} - ${p.brand} - ${p.pack} x ${p.quantity}`)
      .join("\n");

    const text = `
SWIFTLOGIX INVOICE
-----------------------------
Invoice ID: INV-${order.id}

Shop: ${order.shopName}

Products:
${productList}

Total Amount: ₹${order.totalAmount}

Drop Location:
${order.dropLat}, ${order.dropLng}

Generated: ${new Date().toLocaleString()}
`;

    const blob = new Blob([text], { type:"text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    a.click();
  };

  // ✅ DIRECT UPI PAYMENT
  const confirmSubmit = async () => {

    if (!form.shopName || products.length === 0) {
      alert("Fill required fields");
      return;
    }

    const totalAmount = calculateTotal();

    // 🔥 CHANGE THIS UPI ID
    const upiId = "yourupi@okaxis";

    const name = "SwiftLogix";
    const note = `Order Payment ₹${totalAmount}`;

    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

    // 🚀 OPEN UPI APP
    window.location.href = upiUrl;

    // ⏳ WAIT & CREATE ORDER (basic flow)
    setTimeout(async () => {

      try {

        const res = await fetch("/api/orders",{
          method:"POST",
          headers:{ "Content-Type":"application/json"},
          body:JSON.stringify({
            ...form,
            totalAmount
          })
        });

        const data = await res.json();

        generateInvoice(data);

        alert("✅ Order Created after payment");

        localStorage.removeItem("selectedProducts");
        setProducts([]);

        setLoading(false);

      } catch (err) {
        alert("Error creating order");
      }

    }, 5000);
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
          onClick={()=>router.push("/products")}
          style={productBtn}
        >
          📦 Select Products
        </button>

        <textarea
          value={form.product}
          readOnly
          placeholder="Selected products will appear here"
          style={textarea}
        />

        <input
          name="Mobno"
          placeholder="Mobile Number"
          value={form.Mobno}
          onChange={handleChange}
          style={input}
        />

        <h3 style={{marginTop:10}}>📍 Drop Location</h3>

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

        <button
          onClick={detectDropLocation}
          style={locationButton}
        >
          {detecting ? "Detecting..." : "📍 Auto Detect Location"}
        </button>

        <button
          onClick={()=>setShowPopup(true)}
          style={submitBtn}
        >
          🚚 Submit Order
        </button>

        <button
          onClick={()=>router.push("/track")}
          style={trackBtn}
        >
          📍 Track My Orders
        </button>

      </div>

      {/* POPUP */}
      {showPopup && (

        <div style={overlay}>

          <div style={popup}>

            <h3>Confirm Order</h3>

            <p>Total Amount: ₹{calculateTotal()}</p>

            <div style={{marginTop:20}}>

              <button
                onClick={confirmSubmit}
                style={confirmBtn}
              >
                Pay via UPI
              </button>

              <button
                onClick={()=>setShowPopup(false)}
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

/* STYLES (UNCHANGED) */

const container={ minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", background:"linear-gradient(135deg,#141E30,#243B55)" };
const card={ background:"white", padding:"35px", borderRadius:"20px", width:"430px", boxShadow:"0 20px 40px rgba(0,0,0,0.2)" };
const title={ textAlign:"center", fontSize:"30px", fontWeight:"bold" };
const subtitle={ textAlign:"center", color:"#666", marginBottom:"20px" };
const input={ width:"100%", padding:"12px", marginBottom:"12px", borderRadius:"10px", border:"1px solid #ddd", fontSize:"14px" };
const textarea={ width:"100%", padding:"12px", minHeight:"70px", marginBottom:"12px", borderRadius:"10px", border:"1px solid #ddd" };
const row={ display:"flex", justifyContent:"space-between" };
const halfInput={ width:"48%", padding:"12px", borderRadius:"10px", border:"1px solid #ddd" };
const productBtn={ width:"100%", padding:"12px", borderRadius:"10px", border:"none", background:"#ff9800", color:"white", fontWeight:"bold", marginBottom:"10px", cursor:"pointer" };
const locationButton={ width:"100%", padding:"10px", borderRadius:"10px", border:"none", background:"#2962ff", color:"white", marginTop:"10px", cursor:"pointer" };
const submitBtn={ width:"100%", padding:"14px", marginTop:"15px", borderRadius:"12px", border:"none", background:"#00c853", color:"white", fontWeight:"bold", cursor:"pointer" };
const trackBtn={ width:"100%", padding:"12px", marginTop:"10px", borderRadius:"10px", border:"none", background:"#673ab7", color:"white", cursor:"pointer" };
const overlay={ position:"fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.6)", display:"flex", justifyContent:"center", alignItems:"center" };
const popup={ background:"white", padding:"25px", borderRadius:"15px", width:"300px", textAlign:"center" };
const confirmBtn={ background:"#00c853", color:"white", border:"none", padding:"10px 15px", borderRadius:"8px", marginRight:"10px", cursor:"pointer" };
const cancelBtn={ background:"#ff5252", color:"white", border:"none", padding:"10px 15px", borderRadius:"8px", cursor:"pointer" };
