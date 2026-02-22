import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import shield from "../assets/shield.svg";

export default function Dashboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/auth/me");
        // your backend might return: { message, user: req.user }
        setUser(res.data.user || res.data);
      } catch (e) {
        setErr("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => nav("/login"), 800);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [nav]);

  return (
    <div className="page">
      <div className="shell">
        <div className="brandIcon">
          <img src={shield} alt="shield" />
        </div>
        <h1 className="brandTitle">SecureCloud</h1>
        <p className="brandSubtitle">Access Portal</p>

        <div className="card">
          <div className="dashTop">
            <h2 className="cardTitle" style={{ margin: 0 }}>
              Dashboard
            </h2>
            <button className="smallBtn" onClick={logout}>
              Logout
            </button>
          </div>

          <div className="hr" />

          {loading && <p className="helper">Loading profile...</p>}

          {!loading && err && <div className="toast err">{err}</div>}

          {!loading && user && (
            <div>
              <div className="toast ok">
                ✅ Authorized! Welcome, <b>{user.name || "User"}</b>
              </div>

              <p className="helper" style={{ textAlign: "left" }}>
                <b>Email:</b> {user.email || "—"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

