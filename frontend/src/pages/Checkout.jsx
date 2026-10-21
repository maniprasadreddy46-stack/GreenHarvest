import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Field from "../components/Field.jsx";
import { Empty } from "../components/StatusMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { orderApi } from "../api/index.js";
import { getErrorMessage, getFieldErrors } from "../api/client.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { formatPrice } from "../utils/format.js";

export default function Checkout() {
  usePageTitle("Checkout");
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: user?.fullName || "", phone: "", deliveryAddress: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  if (items.length === 0) {
    return (
      <div className="container page">
        <h1>Checkout</h1>
        <Empty title="Your cart is empty">
          <Link to="/shop" className="btn btn--primary">Browse the shop</Link>
        </Empty>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.customerName.trim()) next.customerName = "Enter your name";
    if (!/^[0-9+\-\s]{10,15}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number (10 to 15 digits)";
    if (form.deliveryAddress.trim().length < 10) next.deliveryAddress = "Enter your full delivery address (at least 10 characters)";
    setErrors(next);
    setMessage("");
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      // Only ids and quantities are sent. The server looks up prices and works out the total itself.
      const order = await orderApi.place({
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      clear();
      navigate("/orders", { state: { placedOrderId: order.id }, replace: true });
    } catch (err) {
      setErrors(getFieldErrors(err));
      setMessage(getErrorMessage(err, "We could not place your order."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page">
      <h1>Checkout</h1>
      <p className="notice">
        This is a demo order flow. Your order is saved, but no payment is taken and nothing will be delivered.
      </p>
      <div className="cart">
        <form className="form" onSubmit={submit} noValidate>
          {message && <p className="notice notice--error" role="alert">{message}</p>}
          <Field id="customerName" label="Full name" autoComplete="name" value={form.customerName} onChange={change} error={errors.customerName} />
          <Field id="phone" type="tel" label="Phone number" autoComplete="tel" value={form.phone} onChange={change} error={errors.phone} />
          <Field id="deliveryAddress" as="textarea" rows={4} label="Delivery address" autoComplete="street-address" value={form.deliveryAddress} onChange={change} error={errors.deliveryAddress} />
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? "Placing order…" : "Place demo order"}
          </button>
        </form>

        <aside className="summary" aria-label="Order summary">
          <h2>Your items</h2>
          <ul className="summary__items">
            {items.map((i) => (
              <li key={i.id}>
                <span>{i.quantity} × {i.name}</span>
                <span>{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl>
            <div className="summary__total"><dt>Estimated total</dt><dd>{formatPrice(subtotal)}</dd></div>
          </dl>
          <p className="muted small">The server confirms the final total from current prices.</p>
        </aside>
      </div>
    </div>
  );
}
