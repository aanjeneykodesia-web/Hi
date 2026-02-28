import { useEffect, useState } from "react";

export default function Shopkeeper() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const generateInvoice = (order) => {
    const win = window.open("", "_blank");

    win.document.write(`
      <h2>SwiftLogix Invoice</h2>
      <p><b>Order ID:</b> ${order.id}</p>
      <p><b>Shop:</b> ${order.shopName}</p>
      <p><b>Product:</b> ${order.productType}</p>
      <p><b>Weight:</b> ${order.weight} tons</p>
      <p><b>Status:</b> ${order.status}</p>
      <hr/>
      <h3>Total Freight: ₹ ${order.weight * 1500}</h3>
    `);

    win.document.close();
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Shopkeeper Dashboard</h2>

      {orders.map(order => (
        <div key={order.id} style={card}>
          <p><b>ID:</b> {order.id}</p>
          <p><b>Status:</b> {order.status}</p>

          <button onClick={() => generateInvoice(order)}>
            Generate Invoice
          </button>
        </div>
      ))}
    </div>
  );
}

const card = {
  padding: 15,
  marginBottom: 15,
  background: "#f1f1f1",
  borderRadius: 10
};
