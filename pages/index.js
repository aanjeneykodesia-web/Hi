import Link from "next/link";

export default function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f8f9fa" }}>

      {/* NAVBAR */}
      <header style={{
        background: "#111",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2 style={{ margin: 0 }}>SwiftLogix</h2>

        <div>
          <Link href="/manufacturer" style={navBtn}>Manufacturer</Link>
          <Link href="/transporter" style={navBtn}>Transporter</Link>
          <Link href="/admin" style={adminBtn}>Admin</Link>
        <Link href="/shopkeeper" style={navBtn}>Shopkeeper</Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{
        padding: "100px 20px",
        textAlign: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "white"
      }}>
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
          Uttar Pradesh's Smart Logistics Network
        </h1>
        <p style={{ fontSize: "20px", marginBottom: "30px" }}>
          Connecting Manufacturers & Verified Transporters Directly
        </p>
        <button style={primaryBtn}>Post a Load</button>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2>How It Works</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "40px", flexWrap: "wrap" }}>
          <div style={card}>
            <h3>1. Post Load</h3>
            <p>Manufacturer posts pickup & drop details.</p>
          </div>

          <div style={card}>
            <h3>2. Get Transporter</h3>
            <p>Verified truck owners accept the load.</p>
          </div>

          <div style={card}>
            <h3>3. Safe Delivery</h3>
            <p>Track shipment and confirm delivery.</p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "60px 20px", background: "#fff", textAlign: "center" }}>
        <h2>Our Services</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginTop: "40px", flexWrap: "wrap" }}>
          <div style={card}>
            <h3>Full Truck Load (FTL)</h3>
            <p>14ft, 17ft, 19ft Trucks Across UP</p>
          </div>

          <div style={card}>
            <h3>Verified Drivers</h3>
            <p>Document checked & approved transporters</p>
          </div>

          <div style={card}>
            <h3>Direct Booking</h3>
            <p>No middle brokers. Transparent pricing.</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: "60px 20px", textAlign: "center" }}>
        <h2>Contact Us</h2>
        <p>Email: support@swiftlogix.in</p>
        <p>Phone: +91 XXXXX XXXXX</p>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "#111",
        color: "white",
        padding: "20px",
        textAlign: "center"
      }}>
        © 2026 SwiftLogix Logistics | Uttar Pradesh
      </footer>

    </div>
  );
}

const navBtn = {
  color: "white",
  marginRight: "20px",
  textDecoration: "none"
};

const adminBtn = {
  background: "#00c853",
  padding: "8px 15px",
  borderRadius: "5px",
  color: "white",
  textDecoration: "none"
};

const primaryBtn = {
  background: "#00c853",
  color: "white",
  padding: "15px 30px",
  fontSize: "16px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const card = {
  background: "#f1f1f1",
  padding: "25px",
  borderRadius: "10px",
  width: "280px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
};
