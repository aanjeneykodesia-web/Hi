export default function Transporter() {
  return (
    <div style={{ fontFamily: "Arial", background: "#f4f6f9", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "#111", color: "white", padding: "20px" }}>
        <h2>Transporter Dashboard</h2>
      </div>

      <div style={{ padding: "30px" }}>

        {/* Available Loads */}
        <div style={card}>
          <h3>Available Loads</h3>

          <div style={loadBox}>
            <p><strong>Pickup:</strong> Lucknow</p>
            <p><strong>Drop:</strong> Kanpur</p>
            <p><strong>Material:</strong> Furniture</p>
            <p><strong>Weight:</strong> 8 Tons</p>
            <p><strong>Price:</strong> ₹18,000</p>
            <button style={primaryBtn}>Accept Load</button>
          </div>

        </div>

        {/* Accepted Loads */}
        <div style={{ ...card, marginTop: "30px" }}>
          <h3>Accepted Loads</h3>
          <p>No accepted loads yet.</p>
        </div>

      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  maxWidth: "600px"
};

const loadBox = {
  background: "#f1f1f1",
  padding: "15px",
  borderRadius: "8px",
  marginTop: "15px"
};

const primaryBtn = {
  background: "#2962ff",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
