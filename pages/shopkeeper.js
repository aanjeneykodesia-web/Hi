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

  // LOAD PRODUCTS
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

    // Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

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

  // ✅ INVOICE WITH TOTAL
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

  // ✅ FINAL SUBMIT WITH PAYMENT
  const confirmSubmit = async () => {

    if (!form.shopName || products.length === 0) {
      alert("Fill required fields");
      return;
    }

    setLoading(true);

    const totalAmount = calculateTotal();

    try {

      // 🔹 Create payment order
      const res = await fetch("/api/payment",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({ amount: totalAmount })
      });

      const order = await res.json();

      // 🔹
