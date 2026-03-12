import { useRouter } from "next/router";

export default function Products() {

  const router = useRouter();

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

  const selectProduct = (product, brand, pack) => {

    const selected = {
      product,
      brand,
      pack
    };

    localStorage.setItem("selectedProduct", JSON.stringify(selected));

    router.push("/shopkeeper");
  };

  return (
    <div style={container}>

      <h2>📦 Available Products</h2>

      {products.map((p, index) => (

        <div key={index} style={card}>

          <h3>{p.name}</h3>

          <p><b>Select Brand:</b></p>

          {p.brands.map((brand) => (

            <div key={brand}>

              <p>{brand}</p>

              {p.packs.map((pack) => (

                <button
                  key={pack}
                  style={button}
                  onClick={() => selectProduct(p.name, brand, pack)}
                >
                  {brand} - {pack}
                </button>

              ))}

            </div>

          ))}

        </div>

      ))}

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
