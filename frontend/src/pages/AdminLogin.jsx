import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-hooks";
import "./Appointment.css";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setCredentials((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(credentials.username, credentials.password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch {
      setError("Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="inner-page">
      <div className="container appointment-layout">
        <div className="inner-hero">
          <span>Admin</span>
          <h1>Sign in to manage the clinic site.</h1>
          <p>Enter your admin credentials to edit content and review leads.</p>
        </div>

        <form className="appointment-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            aria-label="Username"
            value={credentials.username}
            onChange={(event) => handleChange("username", event.target.value)}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <input
            type="password"
            placeholder="Password"
            aria-label="Password"
            value={credentials.password}
            onChange={(event) => handleChange("password", event.target.value)}
            required
            style={{ gridColumn: "1 / -1" }}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
          {error ? <p className="inner-form-feedback" style={{ color: "#c0392b" }}>{error}</p> : null}
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
