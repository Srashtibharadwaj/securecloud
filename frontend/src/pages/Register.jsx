import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import shield from "../assets/shield.svg";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!form.name || !form.email || !form.password) {
      setMsg({ type: "err", text: "Please fill all fields." });
      return;
    }

    try {
      setLoading(true);

      // ✅ Debug (you will see this in Console)
      console.log("Register sending:", form);

      const res = await api.post("/api/auth/register", form);

      console.log("Register success:", res.data);

      setMsg({ type: "ok", text: "Registered ✅ Now login!" });
      setTimeout(() => nav("/login"), 700);
    } catch (err) {
      // ✅ Debug (you will see the REAL backend error in Console)
      console.log("Register error:", err?.response?.status, err?.response?.data, err?.message);

      const backendMsg =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (Array.isArray(err?.response?.data?.errors) ? err.response.data.errors[0]?.msg : null) ||
        err?.message ||
        "Register failed. Try again.";

      setMsg({ type: "err", text: backendMsg });
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
          <h2 className="cardTitle">Create Account</h2>

          <form onSubmit={submit}>
            <div className="field">
              <label className="label">Full Name</label>
              <input
                className="input"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label className="label">Email Address</label>
              <input
                className="input"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@gmail.com"
                type="email"
                autoComplete="email"
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
                autoComplete="new-password"
              />
            </div>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {msg.text && <div className={`toast ${msg.type}`}>{msg.text}</div>}

          <div className="hr" />
          <div className="helper">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

