import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {

  const router = useRouter();

  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    const users = {
      admin: "admin123",
      manufacturer: "manu123",
      transporter: "truck123",
      shopkeeper: "shop123"
    };

    if (password === users[role]) {

      if (role === "admin") router.push("/admin");
      if (role === "manufacturer") router.push("/manufacturer");
      if (role === "transporter") router.push("/transporter");
      if (role === "shopkeeper") router.push("/shopkeeper");

    } else {
      alert("Incorrect password ❌");
    }
  };

  return (
    <div style={container}>

      <div style={card}>

        <h1 style={title}>SwiftLogix</h1>
        <p style={subtitle}>Login to Dashboard</p>

        <label style={label}>Select Role</label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={input}
        >
          <option value="admin">Admin</option>
          <option value="manufacturer">Manufacturer</option>
          <option value="transporter">Transporter</option>
          <option value="shopkeeper">Shopkeeper</option>
        </select>

        <label style={label}>Password</label>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button onClick={handleLogin} style={button}>
          Login
        </button>

      </div>

    </div>
  );
}

/* STYLES */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)"
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "15px",
  width: "350px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.3)"
};

const title = {
  textAlign: "center",
  margin: 0
};

const subtitle = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#666"
};

const label = {
  fontSize: "14px",
  marginTop: "10px"
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  borderRadius: "8px",
  border: "1px solid #ccc"
};

const button = {
  width: "100%",
  marginTop: "20px",
  padding: "12px",
  background: "#00c853",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontSize: "16px",
  cursor: "pointer"
};
