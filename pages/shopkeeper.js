import { useState } from "react";
import { useRouter } from "next/router";

export default function Shopkeeper() {

  const router = useRouter();

  const [shopName, setShopName] = useState("");
  const [products, setProducts] = useState([
    { name: "", quantity: "" }
  ]);

  const [dropLat, setDropLat] = useState("");
  const [dropLng, setDropLng] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ADD PRODUCT
  const addProduct = () => {
    setProducts([...products, { name: "", quantity: "" }]);
  };

  // REMOVE PRODUCT
  const removeProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  // UPDATE PRODUCT
  const updateProduct = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  // AUTO LOCATION
  const detectLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition((pos) => {

      setDropLat(pos.coords.latitude.toFixed(6));
      setDropLng(pos.coords.longitude.toFixed(6));

      setDetecting(false);

    });
  };

  // GENERATE INVOICE
  const generateInvoice = (order) => {

    let productList = "";

    order.products.forEach((p, i) => {
      productList += `${i + 1}. ${p.name} - Qty: ${p.quantity}\n`;
    });

    const text = `
SWIFTLOGIX INVOICE
----------------------------

Shop: ${order.shopName}

Products:
${productList}

Drop Location:
${order.dropLat}, ${order.dropLng}

Status: Pending Admin Approval

Generated: ${new Date().toLocaleString()}
`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice.txt";
    a.click();
  };

  // SUBMIT ORDER
  const submitOrder = async () => {

    const body = {
      shopName,
      products,
      dropLat,
      dropLng
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    generateInvoice(data);

    alert("Order Created 🚚");

    setShopName("");
    setProducts([{ name: "", quantity: "" }]);
  };

  return (
    <div style={container}>

      <h2>Shopkeeper Dashboard</h2>

      <input
        placeholder="Shop Name"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
        style={input}
      />

      <h3>Products</h3>

      {products.map((p, index) => (

        <div key={index} style={row}>

          <input
            placeholder="Product Name"
            value={p.name}
            onChange={(e) =>
              updateProduct(index, "name", e.target.value)
            }
            style={productInput}
          />

          <input
            placeholder="Quantity"
            value={p.quantity}
            onChange={(e) =>
              updateProduct(index, "quantity", e.target.value)
            }
            style={qtyInput}
          />

          <button onClick={() => removeProduct(index)}>
            ❌
          </button>

        </div>

      ))}

      <button onClick={addProduct} style={addBtn}>
        + Add Product
      </button>

      <h3>Drop Location</h3>

      <input
        placeholder="Latitude"
        value={dropLat}
        onChange={(e) => setDropLat(e.target.value)}
        style={input}
      />

      <input
        placeholder="Longitude"
        value={dropLng}
        onChange={(e) => setDropLng(e.target.value)}
        style={input}
      />

      <button onClick={detectLocation}>
        {detecting ? "Detecting..." : "Use My Location"}
      </button>

      <button
        style={submitBtn}
        onClick={() => setShowPopup(true)}
      >
        Submit Order
      </button>

      {showPopup && (
        <div style={popup}>

          <h3>Confirm Order</h3>

          <button onClick={submitOrder}>
            Confirm
          </button>

          <button onClick={() => setShowPopup(false)}>
            Cancel
          </button>

        </div>
      )}

    </div>
  );
}

/* STYLES */

const container = {
  padding: 40,
  fontFamily: "Arial"
};

const input = {
  display: "block",
  padding: 10,
  marginBottom: 10
};

const row = {
  display: "flex",
  gap: 10,
  marginBottom: 10
};

const productInput = {
  padding: 8
};

const qtyInput = {
  width: 80
};

const addBtn = {
  marginBottom: 20
};

const submitBtn = {
  marginTop: 20,
  padding: 10
};

const popup = {
  position: "fixed",
  top: "40%",
  left: "40%",
  background: "white",
  padding: 20,
  border: "1px solid #ccc"
};
