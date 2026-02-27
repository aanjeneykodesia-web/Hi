import { useState, useEffect } from "react";

export default function Admin() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    await fetch("/api/updateStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });

    fetchOrders();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Control Panel</h1>

      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Pickup</th>
            <th>Delivery</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.product}</td>
              <td>{order.pickup}</td>
              <td>{order.delivery}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => updateStatus(order.id, "Approved")}>
                  Approve
                </button>

                <button onClick={() => updateStatus(order.id, "Rejected")}>
                  Reject
                </button>

                <button onClick={() => updateStatus(order.id, "In Transit")}>
                  Dispatch
                </button>

                <button onClick={() => updateStatus(order.id, "Delivered")}>
                  Delivered
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  }
