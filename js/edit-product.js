
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

document.getElementById("editForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Product " + id + " updated");
});
