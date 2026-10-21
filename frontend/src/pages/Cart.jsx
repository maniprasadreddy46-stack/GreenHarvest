import { Link } from "react-router-dom";
import ProductImage from "../components/ProductImage.jsx";
import QuantityStepper from "../components/QuantityStepper.jsx";
import { Empty } from "../components/StatusMessage.jsx";
import { useCart } from "../context/CartContext.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { formatPrice } from "../utils/format.js";

export default function Cart() {
  usePageTitle("Your cart");
  const { items, subtotal, setQuantity, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="container page">
        <h1>Your cart</h1>
        <Empty title="Your cart is empty">
          <p>Add something fresh from the farm.</p>
          <Link to="/shop" className="btn btn--primary">Browse the shop</Link>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>Your cart</h1>
      <div className="cart">
        <ul className="cart__list">
          {items.map((item) => (
            <li key={item.id} className="cart__row">
              <div className="cart__thumb">
                <ProductImage product={item} />
              </div>
              <div className="cart__info">
                <Link to={`/shop/${item.id}`} className="cart__name">{item.name}</Link>
                <p className="muted small">{formatPrice(item.price)} per {item.unit}</p>
                <button type="button" className="link link--danger" onClick={() => remove(item.id)}>
                  Remove
                </button>
              </div>
              <QuantityStepper
                value={item.quantity}
                max={item.stockQuantity}
                label={`Quantity of ${item.name}`}
                onChange={(q) => setQuantity(item.id, q)}
              />
              <p className="cart__line">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <aside className="summary" aria-label="Order summary">
          <h2>Summary</h2>
          <dl>
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="summary__total"><dt>Total</dt><dd>{formatPrice(subtotal)}</dd></div>
          </dl>
          <p className="muted small">
            Demo shop: no payment is taken. The final total is confirmed by the server when you place the order.
          </p>
          <Link to="/checkout" className="btn btn--primary btn--block">Go to checkout</Link>
          <button type="button" className="btn btn--ghost btn--block" onClick={clear}>
            Empty cart
          </button>
        </aside>
      </div>
    </div>
  );
}
