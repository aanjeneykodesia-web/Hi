const API = "https://c-production-c7d3.up.railway.app";

if (localStorage.getItem("role") !== "admin") {
  document.body.innerHTML = "Access Denied";
}

const id = new URLSearchParams(window.location.search).get("id");

fetch(API + "/admin/products")
  .then(r => r.json())
  .then(d => {
    const item = d.products.find(p => p.id === id);
    pname.value = item.name;
    pprice.value = item.price;
    pqty.value = item.qty;
  });

function updateProduct() {
  fetch(API + "/admin/update-product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      price: pprice.value,
      qty: pqty.value
    })
  }).then(() => {
    alert("Item updated");
    window.location.href = "admin.html";
  });
}