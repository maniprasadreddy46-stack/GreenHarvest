import { Link } from "react-router-dom";
import ProductImage from "./ProductImage.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "./Toast.jsx";
import { formatPrice } from "../utils/format.js";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const toast = useToast();
  const soldOut = product.stockQuantity <= 0;

  const handleAdd = () => {
    add(product, 1);
    toast.show(`${product.name} added to your cart`);
  };

  return (
    <article className="pcard">
      <Link to={`/shop/${product.id}`} className="pcard__media" aria-label={`View ${product.name}`}>
        <ProductImage product={product} />
      </Link>
      <div className="pcard__body">
        <p className="pcard__cat">{product.categoryName}</p>
        <h3 className="pcard__name">
          <Link to={`/shop/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="pcard__price">
          {formatPrice(product.price)} <span>per {product.unit}</span>
        </p>
        <p className={`pcard__stock${soldOut ? " is-out" : product.stockQuantity < 10 ? " is-low" : ""}`}>
          {soldOut ? "Out of stock" : product.stockQuantity < 10 ? `Only ${product.stockQuantity} left` : "In stock"}
        </p>
        <button type="button" className="btn btn--primary btn--block" onClick={handleAdd} disabled={soldOut}>
          {soldOut ? "Sold out" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
