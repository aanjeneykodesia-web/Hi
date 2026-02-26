export default function Manufacturer() {
  return (
    <div style={{ fontFamily: "Arial", background: "#f4f6f9", minHeight: "100vh" }}>
      
      {/* Header */}
      <div style={{ background: "#111", color: "white", padding: "20px" }}>
        <h2>Manufacturer Dashboard</h2>
      </div>

      <div style={{ padding: "30px" }}>

        {/* Post Load Form */}
        <div style={card}>
          <h3>Post New Load</h3>

          <input placeholder="Pickup Location" style={input} />
          <input placeholder="Drop Location" style={input} />
          <input placeholder="Material Type" style={input} />
          <input placeholder="Weight (in tons)" style={input} />
          <input placeholder="Truck Type (14ft / 17ft / 19ft)" style={input} />
          <input placeholder="Expected Price (₹)" style={input} />

          <button style={primaryBtn}>Submit Load</button>
        </div>

        {/* Active Loads */}
        <div style={{ ...card, marginTop: "30px" }}>
          <h3>Active Loads</h3>
          <p>No loads posted yet.</p>
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

const input = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const primaryBtn = {
  background: "#00c853",
  color: "white",
  padding: "12px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
