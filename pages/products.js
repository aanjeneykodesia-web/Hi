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
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    brands: "",
    packs: ""
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");

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

  // ✅ Add product to order
  const addSelectedProduct = (product, brand, pack) => {
    const selected = { product, brand, pack };

    const updated = [...selectedProducts, selected];
    setSelectedProducts(updated);
    localStorage.setItem("selectedProducts", JSON.stringify(updated));

    alert(`${product} - ${brand} - ${pack} added`);
  };

  const goToShopkeeper = () => {
    router.push("/shopkeeper");
  };

  // ✅ Add new product (Admin only)
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.brands || !newProduct.packs) {
      alert("Please fill all fields");
      return;
    }

    const productToAdd = {
      name: newProduct.name,
      brands: newProduct.brands.split(",").map((b) => b.trim()),
      packs: newProduct.packs.split(",").map((p) => p.trim())
    };

    const saved = JSON.parse(localStorage.getItem("adminProducts")) || [];
    const updated = [...saved, productToAdd];

    localStorage.setItem("adminProducts", JSON.stringify(updated));
    setProducts([...defaultProducts, ...updated]);

    setNewProduct({ name: "", brands: "", packs: "" });
    setShowAdminForm(false);

    alert("Product added successfully");
  };

  // ✅ Delete product
  const handleDeleteProduct = (index) => {
    if (!confirm("Delete this product?")) return;

    const defaultLength = defaultProducts.length;

    if (index < defaultLength) {
      alert("Default products cannot be deleted");
      return;
    }

    const adminProducts =
      JSON.parse(localStorage.getItem("adminProducts")) || [];

    const updated = adminProducts.filter(
      (_, i) => i !== index - defaultLength
    );

    localStorage.setItem("adminProducts", JSON.stringify(updated));
    setProducts([...defaultProducts, ...updated]);
  };

  // ✅ Edit product
  const handleEditProduct = (index) => {
    const defaultLength = defaultProducts.length;

    if (index < defaultLength) {
      alert("Default products cannot be edited");
      return;
    }

    const adminProducts =
      JSON.parse(localStorage.getItem("adminProducts")) || [];

    const product = adminProducts[index - defaultLength];

    const name = prompt("Product name", product.name);
    const brands = prompt("Brands (comma separated)", product.brands.join(", "));
    const packs = prompt("Packs (comma separated)", product.packs.join(", "));

    if (!name || !brands || !packs) return;

    adminProducts[index - defaultLength] = {
      name,
      brands: brands.split(",").map((b) => b.trim()),
      packs: packs.split(",").map((p) => p.trim())
    };

    localStorage.setItem("adminProducts", JSON.stringify(adminProducts));
    setProducts([...defaultProducts, ...adminProducts]);
  };

  const clearSelectedProducts = () => {
    setSelectedProducts([]);
    localStorage.removeItem("selectedProducts");
  };

  return (
    <div style={container}>
      <div style={header}>
        <h1 style={title}>📦 Product Management</h1>
        <p style={subtitle}>Select multiple products</p>
      </div>

      <div style={topActions}>
        {isAdmin && (
          <button
            style={adminButton}
            onClick={() => setShowAdminForm(!showAdminForm)}
          >
            {showAdminForm ? "Close Admin Panel" : "Admin Add Product"}
          </button>
        )}

        <button style={goButton} onClick={goToShopkeeper}>
          Go To Shopkeeper ({selectedProducts.length})
        </button>

        <button style={clearButton} onClick={clearSelectedProducts}>
          Clear Selected
        </button>
      </div>

      {showAdminForm && isAdmin && (
        <div style={adminCard}>
          <h2>Add New Product</h2>

          <input
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            style={input}
          />

          <input
            placeholder="Brands (comma separated)"
            value={newProduct.brands}
            onChange={(e) =>
              setNewProduct({ ...newProduct, brands: e.target.value })
            }
            style={input}
          />

          <input
            placeholder="Packs (comma separated)"
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
          <p>No products selected</p>
        ) : (
          selectedProducts.map((item, i) => (
            <div key={i} style={selectedItem}>
              {item.product} - {item.brand} - {item.pack}
            </div>
          ))
        )}
      </div>

      <div style={grid}>
        {products.map((p, index) => (
          <div key={index} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{p.name}</h3>

              {isAdmin && (
                <div>
                  <button
                    style={editBtn}
                    onClick={() => handleEditProduct(index)}
                  >
                    ✏️
                  </button>

                  <button
                    style={deleteBtn}
                    onClick={() => handleDeleteProduct(index)}
                  >
                    ❌
                  </button>
                </div>
              )}
            </div>

            {p.brands.map((brand) => (
              <div key={brand}>
                <h4>{brand}</h4>

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
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ✅ Styles */

const container = { padding: "30px" };
const header = { textAlign: "center", marginBottom: "20px" };
const title = { fontSize: "30px" };
const subtitle = { color: "gray" };

const topActions = {
  display: "flex",
  gap: "10px",
  justifyContent: "center",
  marginBottom: "20px",
  flexWrap: "wrap"
};

const adminButton = { padding: "10px", background: "black", color: "white" };
const goButton = { padding: "10px", background: "blue", color: "white" };
const clearButton = { padding: "10px", background: "red", color: "white" };

const adminCard = { background: "white", padding: "20px", marginBottom: "20px" };
const input = { width: "100%", marginBottom: "10px", padding: "10px" };
const saveButton = { background: "green", color: "white", padding: "10px" };

const selectedBox = { background: "#eee", padding: "15px", marginBottom: "20px" };
const selectedItem = { padding: "5px" };

const grid = { display: "grid", gap: "15px" };
const card = { padding: "15px", background: "#fff" };

const button = {
  margin: "5px",
  padding: "8px",
  background: "#2563eb",
  color: "white",
  border: "none"
};

const editBtn = { marginRight: "5px", background: "orange", color: "white" };
const deleteBtn = { background: "red", color: "white" };
