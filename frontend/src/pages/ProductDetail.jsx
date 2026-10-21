import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductImage from "../components/ProductImage.jsx";
import QuantityStepper from "../components/QuantityStepper.jsx";
import { ErrorBox, Loading } from "../components/StatusMessage.jsx";
import { useToast } from "../components/Toast.jsx";
import { useCart } from "../context/CartContext.jsx";
import useFetch from "../hooks/useFetch.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { shopApi } from "../api/index.js";
import { formatPrice } from "../utils/format.js";

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, loading, error, reload } = useFetch(() => shopApi.product(id), [id]);
  const { add } = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(1);
  usePageTitle(product ? product.name : "Product");

  if (loading) return <div className="container page"><Loading label="Loading product…" /></div>;
  if (error) {
    return (
      <div className="container page">
        <ErrorBox message={error} onRetry={reload} />
        <p><Link to="/shop" className="link">Back to the shop</Link></p>
      </div>
    );
  }

  const soldOut = product.stockQuantity <= 0;

  return (
    <div className="container page">
      <p><Link to="/shop" className="link">← All products</Link></p>
      <div className="detail">
        <div className="detail__media">
          <ProductImage product={product} />
        </div>
        <div className="detail__info">
          <p className="pcard__cat">{product.categoryName}</p>
          <h1>{product.name}</h1>
          <p className="detail__price">
            {formatPrice(product.price)} <span>per {product.unit}</span>
          </p>
          {product.description && <p className="lead-sm">{product.description}</p>}
          <p className={`pcard__stock${soldOut ? " is-out" : product.stockQuantity < 10 ? " is-low" : ""}`}>
            {soldOut ? "Out of stock" : `${product.stockQuantity} ${product.unit} available`}
          </p>
          {!soldOut && (
            <div className="detail__buy">
              <QuantityStepper value={qty} max={product.stockQuantity} onChange={setQty} />
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  add(product, qty);
                  toast.show(`${qty} × ${product.name} added to your cart`);
                }}
              >
                Add to cart
              </button>
            </div>
          )}
          <p className="muted small">Demo shop: orders are saved but no payment is taken.</p>
        </div>
      </div>
    </div>
  );
}
