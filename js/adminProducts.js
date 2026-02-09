const API = "https://c-production-c7d3.up.railway.app";

fetch(API + "/admin/products")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("productList");
    list.innerHTML = "";

    data.products.forEach(item => {
      list.innerHTML += `
        <div style="border:1px solid #ccc;padding:10px;margin:8px">
          <b>${item.name}</b><br>
          Price: ${item.price}<br>
          Qty: ${item.qty}<br>
          <button onclick="editItem('${item.id}')">Edit</button>
        </div>
      `;
    });
  });

function editItem(id) {
  window.location.href = "edit-product.html?id=" + id;
}