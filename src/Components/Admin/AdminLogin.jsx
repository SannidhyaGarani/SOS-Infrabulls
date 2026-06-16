import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInAdmin } from "../Firebase/authHelpers";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInAdmin(email, password);
      navigate("/admin", { replace: true });
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: 400, background: "#fff", padding: "2rem", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
        <h2 style={{ margin: 0, marginBottom: "1rem" }}>Admin Login</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}
          />
          {error && <div style={{ color: "#ef4444" }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 12px",
              borderRadius: 8,
              border: "none",
              background: "#1174d6",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
