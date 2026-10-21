import { useState } from "react";
import Field from "../components/Field.jsx";
import usePageTitle from "../hooks/usePageTitle.js";

export default function Contact() {
  usePageTitle("Contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.message.trim().length < 10) next.message = "Write at least 10 characters";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      // Demo only: the message is not sent anywhere.
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="container page">
      <h1>Contact us</h1>
      <div className="split split--top">
        <div className="prose">
          <p className="lead-sm">Ask about an order, a product or a farm visit.</p>
          <address>
            <strong>GreenHarvest Farm</strong><br />
            Farm Road, Your District, India<br />
            hello@greenharvest.example<br />
            Open daily, 8 am to 6 pm
          </address>
        </div>

        <form className="form" onSubmit={submit} noValidate>
          {sent && (
            <p className="notice" role="status">
              Thank you. This is a demo form, so your message was not actually sent.
            </p>
          )}
          <Field id="name" label="Your name" value={form.name} onChange={change} error={errors.name} autoComplete="name" />
          <Field id="email" type="email" label="Email" value={form.email} onChange={change} error={errors.email} autoComplete="email" />
          <Field id="message" as="textarea" rows={5} label="Message" value={form.message} onChange={change} error={errors.message} />
          <button type="submit" className="btn btn--primary">Send message</button>
        </form>
      </div>
    </div>
  );
}
