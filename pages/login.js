import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    // SIMPLE DEMO LOGIN
    if (username === "admin" && password === "admin123") {
      router.push("/admin");
    }
    else if (username === "manufacturer" && password === "man123") {
      router.push("/manufacturer");
    }
    else if (username === "transporter" && password === "trans123") {
      router.push("/transporter");
    }
    else if (username === "shopkeeper" && password === "shop123") {
      router.push("/shopkeeper");
    }
    else {
      alert("Invalid login credentials");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>SwiftLogix Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button onClick={handleLogin} style={btn}>
          Login
        </button>

        <p style={{marginTop:"10px",fontSize:"12px",color:"#777"}}>
          admin / admin123
        </p>

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
  padding: "30px",
  borderRadius: "15px",
  width: "320px",
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
};

const title = {
  marginBottom: "20px"
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#00c853",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
