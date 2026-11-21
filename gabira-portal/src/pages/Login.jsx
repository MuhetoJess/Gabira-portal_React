import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [role, setRole] = useState("donor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      await login(role, email, password);
      setMsg({ text: "Login successful. Redirecting to your dashboard...", type: "success" });
      setTimeout(() => {
        navigate(role === "charity" ? "/charity-dashboard" : "/donor-dashboard");
      }, 700);
    } catch (err) {
      setMsg({ text: err.message, type: "error" });
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="auth-wrap">
        <h2 className="section-title">Log In</h2>
        <div className="role-tabs" role="tablist">
          <button
            type="button"
            className={role === "donor" ? "active" : ""}
            onClick={() => { setRole("donor"); setMsg({ text: "", type: "" }); }}
          >
            Donor Login
          </button>
          <button
            type="button"
            className={role === "charity" ? "active" : ""}
            onClick={() => { setRole("charity"); setMsg({ text: "", type: "" }); }}
          >
            Charity Login
          </button>
        </div>

        <section className="auth-panel active">
          <form className="app-form" onSubmit={handleSubmit}>
            <h2>{role === "donor" ? "Donor Login" : "Charity Login"}</h2>
            <p className="form-sub">
              Try: <code>{role === "donor" ? "alice@example.com" : "hope@example.org"}</code> /{" "}
              <code>{role === "donor" ? "Alice123" : "Hope123"}</code>
            </p>

            <div className="form-row">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              Log In as {role === "donor" ? "Donor" : "Charity"}
            </button>
            {msg.text && <div className={`form-msg show ${msg.type}`}>{msg.text}</div>}
          </form>
        </section>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>.
        </p>
      </div>
    </main>
  );
}