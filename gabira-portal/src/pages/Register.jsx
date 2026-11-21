import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [role, setRole] = useState("donor");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    regNumber: "",
    category: "",
    password: "",
    confirm: ""
  });
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const scorePassword = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const levels = [
    { width: "0%", color: "transparent", text: "" },
    { width: "25%", color: "#c0392b", text: "Weak" },
    { width: "50%", color: "#b9770e", text: "Fair" },
    { width: "75%", color: "#1e8449", text: "Good" },
    { width: "100%", color: "#1e8449", text: "Strong" }
  ];
  const strength = formData.password ? levels[scorePassword(formData.password)] : levels[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm) {
      setMsg({ text: "Passwords do not match.", type: "error" });
      return;
    }

    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      await register(role, formData);
      setMsg({ text: "Account created! Redirecting to dashboard...", type: "success" });
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
        <h2 className="section-title">Create an Account</h2>
        <div className="role-tabs">
          <button
            type="button"
            className={role === "donor" ? "active" : ""}
            onClick={() => { setRole("donor"); setMsg({ text: "", type: "" }); }}
          >
            I'm a Donor
          </button>
          <button
            type="button"
            className={role === "charity" ? "active" : ""}
            onClick={() => { setRole("charity"); setMsg({ text: "", type: "" }); }}
          >
            I'm a Charity
          </button>
        </div>

        <section className="auth-panel active">
          <form className="app-form" onSubmit={handleSubmit}>
            <h2>{role === "donor" ? "Donor Registration" : "Charity Registration"}</h2>
            <p className="form-sub">
              {role === "donor"
                ? "Create a donor account to start giving and tracking your pledges."
                : "Register your organization to receive and manage donations."}
            </p>

            <div className="form-row">
              <label>{role === "donor" ? "Full Name" : "Organization Name"}</label>
              <input
                type="text"
                required
                minLength={role === "donor" ? 2 : 3}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {role === "donor" ? (
              <div className="form-row">
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  pattern="0[0-9]{9}"
                  placeholder="07XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            ) : (
              <>
                <div className="form-row">
                  <label>Registration Number</label>
                  <input
                    type="text"
                    required
                    pattern="NGO-\d{4}-\d{3}"
                    placeholder="NGO-2026-001"
                    value={formData.regNumber}
                    onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <label>Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="Child Welfare">Child Welfare</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Environment">Environment</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-row">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label>Password</label>
              <input
                type="password"
                required
                minLength={8}
                pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
                title="At least 8 characters, including a letter and a number."
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div className="strength-meter">
                <span style={{ width: strength.width, background: strength.color }} />
              </div>
              <span className="hint">{strength.text}</span>
            </div>

            <div className="form-row">
              <label>Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirm}
                onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label>
                <input type="checkbox" required style={{ width: "auto" }} />{" "}
                {role === "donor"
                  ? "I agree to the Terms & Privacy Policy"
                  : "I confirm this organization is a registered non-profit"}
              </label>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              Create {role === "donor" ? "Donor" : "Charity"} Account
            </button>
            {msg.text && <div className={`form-msg show ${msg.type}`}>{msg.text}</div>}
          </form>
        </section>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in here</Link>.
        </p>
      </div>
    </main>
  );
}