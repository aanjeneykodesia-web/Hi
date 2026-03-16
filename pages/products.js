import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Products() {
  const router = useRouter();

  const defaultProducts = [
    {
      name: "Cooking Oil",
      brands: ["Fortune", "Saffola", "Dhara"],
      packs: ["1L", "5L", "15L"]
    },
    {
      name: "Rice",
      brands: ["India Gate", "Daawat", "Fortune"],
      packs: ["5kg", "10kg", "25kg"]
    },
    {
      name: "Sugar",
      brands: ["Madhur", "Trust", "Organic"],
      packs: ["1kg", "5kg", "10kg"]
    }
  ];

  const [products, setProducts] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    brands: "",
    packs: ""
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem("adminProducts");

    if (savedProducts) {
      setProducts([...defaultProducts, ...JSON.parse(savedProducts)]);
    } else {
      setProducts(defaultProducts);
    }

    const savedSelected = localStorage.getItem("selectedProducts");
    if (savedSelected) {
      setSelectedProducts(JSON.parse(savedSelected));
    }
  }, []);

  const addSelectedProduct = (product, brand, pack) => {
    const selected = {
      product,
      brand,
      pack
    };

    const updated = [...selectedProducts, selected];
    setSelectedProducts(updated);
    localStorage.setItem("selectedProducts", JSON.stringify(updated));

    alert(`${product} - ${brand} - ${pack} added`);
  };

  const goToShopkeeper = () => {
    router.push("/shopkeeper");
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.brands || !newProduct.packs) {
      alert("Please fill all fields");
      return;
    }

    const productToAdd = {
      name: newProduct.name,
      brands: newProduct.brands.split(",").map((item) => item.trim()),
      packs: newProduct.packs.split(",").map((item) => item.trim())
    };

    const savedProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
    const updatedAdminProducts = [...savedProducts, productToAdd];

    localStorage.setItem("adminProducts", JSON.stringify(updatedAdminProducts));
    setProducts([...defaultProducts, ...updatedAdminProducts]);

    setNewProduct({
      name: "",
      brands: "",
      packs: ""
    });

    alert("Product added successfully");
    setShowAdminForm(false);
  };

  const clearSelectedProducts = () => {
    setSelectedProducts([]);
    localStorage.removeItem("selectedProducts");
  };

  return (
    <div style={container}>
      <div style={header}>
        <h1 style={title}>📦 Product Management</h1>
        <p style={subtitle}>Select multiple products or add new products as admin</p>
      </div>

      <div style={topActions}>
        <button
          style={adminButton}
          onClick={() => setShowAdminForm(!showAdminForm)}
        >
          {showAdminForm ? "Close Admin Panel" : "Admin Add Product"}
        </button>

        <button style={goButton} onClick={goToShopkeeper}>
          Go To Shopkeeper ({selectedProducts.length})
        </button>

        <button style={clearButton} onClick={clearSelectedProducts}>
          Clear Selected
        </button>
      </div>

      {showAdminForm && (
        <div style={adminCard}>
          <h2 style={adminTitle}>Add New Product</h2>

          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            style={input}
          />

          <input
            type="text"
            placeholder="Brands (comma separated)"
            value={newProduct.brands}
            onChange={(e) =>
              setNewProduct({ ...newProduct, brands: e.target.value })
            }
            style={input}
          />

          <input
            type="text"
            placeholder="Pack Sizes (comma separated)"
            value={newProduct.packs}
            onChange={(e) =>
              setNewProduct({ ...newProduct, packs: e.target.value })
            }
            style={input}
          />

          <button style={saveButton} onClick={handleAddProduct}>
            Save Product
          </button>
        </div>
      )}

      <div style={selectedBox}>
        <h3>Selected Products</h3>
        {selectedProducts.length === 0 ? (
          <p>No product selected yet.</p>
        ) : (
          selectedProducts.map((item, index) => (
            <div key={index} style={selectedItem}>
              {item.product} - {item.brand} - {item.pack}
            </div>
          ))
        )}
      </div>

      <div style={grid}>
        {products.map((p, index) => (
          <div key={index} style={card}>
            <h3 style={productName}>{p.name}</h3>
            <p style={sectionLabel}>Select Brand and Pack</p>

            {p.brands.map((brand) => (
              <div key={brand} style={brandBlock}>
                <h4 style={brandName}>{brand}</h4>

                <div style={packWrap}>
                  {p.packs.map((pack) => (
                    <button
                      key={pack}
                      style={button}
                      onClick={() => addSelectedProduct(p.name, brand, pack)}
                    >
                      {brand} - {pack}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  padding: "30px",
  background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
  fontFamily: "Arial, sans-serif"
};

const header = {
  textAlign: "center",
  marginBottom: "30px"
};

const title = {
  fontSize: "34px",
  marginBottom: "10px",
  color: "#111827"
};

const subtitle = {
  fontSize: "16px",
  color: "#6b7280"
};

const topActions = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "25px"
};

const adminButton = {
  padding: "12px 20px",
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px"
};

const goButton = {
  padding: "12px 20px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px"
};

const clearButton = {
  padding: "12px 20px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px"
};

const selectedBox = {
  maxWidth: "900px",
  margin: "0 auto 30px auto",
  background: "#ffffff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
};

const selectedItem = {
  padding: "10px 12px",
  background: "#f3f4f6",
  borderRadius: "8px",
  marginBottom: "8px"
};

const adminCard = {
  maxWidth: "600px",
  margin: "0 auto 30px auto",
  background: "#ffffff",
  padding: "25px",
  borderRadius: "18px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
};

const adminTitle = {
  marginBottom: "20px",
  color: "#111827"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px"
};

const saveButton = {
  padding: "12px 18px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px"
};

const card = {
  background: "#ffffff",
  padding: "22px",
  borderRadius: "18px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
};

const productName = {
  fontSize: "22px",
  marginBottom: "10px",
  color: "#1f2937"
};

const sectionLabel = {
  color: "#6b7280",
  marginBottom: "12px"
};

const brandBlock = {
  marginBottom: "18px",
  padding: "12px",
  background: "#f9fafb",
  borderRadius: "12px"
};

const brandName = {
  marginBottom: "10px",
  color: "#374151"
};

const packWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px"
};

const button = {
  padding: "10px 14px",
  border: "none",
  background: "#2563eb",
  color: "white",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold"
};
