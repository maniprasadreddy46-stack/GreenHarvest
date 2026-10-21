import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Field from "../components/Field.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage, getFieldErrors } from "../api/client.js";
import usePageTitle from "../hooks/usePageTitle.js";

export default function Login() {
  usePageTitle("Log in");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.email.trim()) next.email = "Enter your email";
    if (!form.password) next.password = "Enter your password";
    setErrors(next);
    setMessage("");
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      const from = location.state?.from;
      navigate(from || (user.role === "ADMIN" ? "/admin" : "/shop"), { replace: true });
    } catch (err) {
      setErrors(getFieldErrors(err));
      setMessage(getErrorMessage(err, "Could not log in. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page page--narrow">
      <h1>Log in</h1>
      <form className="form" onSubmit={submit} noValidate>
        {message && <p className="notice notice--error" role="alert">{message}</p>}
        <Field id="email" type="email" label="Email" autoComplete="email" value={form.email} onChange={change} error={errors.email} />
        <Field id="password" type="password" label="Password" autoComplete="current-password" value={form.password} onChange={change} error={errors.password} />
        <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
        <p className="muted">New here? <Link to="/register" className="link">Create an account</Link></p>
      </form>
    </div>
  );
}
