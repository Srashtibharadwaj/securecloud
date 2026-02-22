import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import shield from "../assets/shield.svg";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!form.email || !form.password) {
      setMsg({ type: "err", text: "Please fill all fields." });
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      nav("/dashboard");
    } catch (err) {
      setMsg({
        type: "err",
        text: err?.response?.data?.msg || "Login failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="shell">
        <div className="brandIcon">
          <img src={shield} alt="shield" />
        </div>

        <h1 className="brandTitle">SecureCloud</h1>
        <p className="brandSubtitle">Access Portal</p>

        <div className="card">
          <h2 className="cardTitle">Sign In</h2>

          <form onSubmit={submit}>
            <div className="field">
              <label className="label">Email Address</label>
              <input
                className="input"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@gmail.com"
                type="email"
              />
            </div>

            <div className="field">
              <label className="label">Password</label>
              <input
                className="input"
                name="password"
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                type="password"
              />
            </div>

            <button className="btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {msg.text && <div className={`toast ${msg.type}`}>{msg.text}</div>}

          <div className="hr" />
          <div className="helper">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

