import { useEffect, useState } from "react";

export default function TrackOrder() {

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {

    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div style={container}>

      <h2>📦 Track My Orders</h2>

      {orders.map((order) => (

        <div key={order.id} style={card}>

          <p><b>Order ID:</b> {order.id}</p>
          <p><b>Product:</b> {order.product}</p>
          <p><b>Status:</b> {order.status}</p>

          {order.currentLat && (

            <div>

              <p>
                <b>Truck Location:</b>  
                {order.currentLat.toFixed(5)}, {order.currentLng.toFixed(5)}
              </p>

              <iframe
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: "10px" }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${order.currentLat},${order.currentLng}&z=15&output=embed`}
              ></iframe>

            </div>

          )}

          {!order.currentLat && (
            <p>Truck has not started delivery yet 🚚</p>
          )}

        </div>

      ))}

    </div>
  );
}

/* STYLES */

const container = {
  padding: "30px",
  background: "#f4f6f9",
  minHeight: "100vh"
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};
