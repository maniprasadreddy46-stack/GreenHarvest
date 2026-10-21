import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/Field.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage, getFieldErrors } from "../api/client.js";
import usePageTitle from "../hooks/usePageTitle.js";

export default function Register() {
  usePageTitle("Create account");
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.password.length < 8) next.password = "Use at least 8 characters";
    if (form.confirm !== form.password) next.confirm = "Passwords do not match";
    setErrors(next);
    setMessage("");
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await register(form.fullName, form.email, form.password);
      navigate("/shop", { replace: true });
    } catch (err) {
      setErrors(getFieldErrors(err));
      setMessage(getErrorMessage(err, "Could not create your account."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page page--narrow">
      <h1>Create your account</h1>
      <form className="form" onSubmit={submit} noValidate>
        {message && <p className="notice notice--error" role="alert">{message}</p>}
        <Field id="fullName" label="Full name" autoComplete="name" value={form.fullName} onChange={change} error={errors.fullName} />
        <Field id="email" type="email" label="Email" autoComplete="email" value={form.email} onChange={change} error={errors.email} />
        <Field id="password" type="password" label="Password" autoComplete="new-password" hint="At least 8 characters" value={form.password} onChange={change} error={errors.password} />
        <Field id="confirm" type="password" label="Confirm password" autoComplete="new-password" value={form.confirm} onChange={change} error={errors.confirm} />
        <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
        <p className="muted">Already registered? <Link to="/login" className="link">Log in</Link></p>
      </form>
    </div>
  );
}
