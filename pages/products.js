import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Products() {

  const router = useRouter();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("selectedProducts");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  const products = [
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

  const addProduct = (product, brand, pack) => {

    const newProduct = {
      product,
      brand,
      pack,
      quantity: 1
    };

    const updatedCart = [...cart, newProduct];

    setCart(updatedCart);

    localStorage.setItem(
      "selectedProducts",
      JSON.stringify(updatedCart)
    );

    alert("Product Added ✅");
  };

  const goBack = () => {
    router.push("/shopkeeper");
  };

  return (
    <div style={container}>

      <h2>📦 Available Products</h2>

      {products.map((p, index) => (

        <div key={index} style={card}>

          <h3>{p.name}</h3>

          {p.brands.map((brand) => (

            <div key={brand}>

              <p><b>{brand}</b></p>

              {p.packs.map((pack) => (

                <button
                  key={pack}
                  style={button}
                  onClick={() => addProduct(p.name, brand, pack)}
                >
                  Add {brand} - {pack}
                </button>

              ))}

            </div>

          ))}

        </div>

      ))}

      <button style={doneBtn} onClick={goBack}>
        Done ✔
      </button>

    </div>
  );
}

const container = {
  padding: "30px",
  fontFamily: "Arial"
};

const card = {
  background: "#fff",
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

const button = {
  padding: "8px 12px",
  margin: "5px",
  border: "none",
  background: "#2962ff",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer"
};

const doneBtn = {
  marginTop: "20px",
  padding: "12px 20px",
  background: "#00c853",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};
