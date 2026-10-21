
import { useState } from "react";

// Product photos matched by product name.
// If a photo fails to load, the existing-style fallback is shown.
const PRODUCT_IMAGES = {
  "A2 Cow Ghee":
    "https://images.unsplash.com/photo-1630144369000-3f5f4b8f6b1a?auto=format&fit=crop&w=800&q=80",
  "Alphonso Mangoes":
    "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
  "Bananas (Robusta)":
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  Carrots:
    "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=800&q=80",
};

function kindFor(categoryName = "") {
  const c = categoryName.toLowerCase();
  if (c.includes("fruit")) return "fruit";
  if (c.includes("grain") || c.includes("pulse")) return "grain";
  if (c.includes("dairy") || c.includes("egg")) return "dairy";
  if (c.includes("honey") || c.includes("preserve")) return "honey";
  return "veg";
}

function Glyph({ kind }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (kind === "fruit") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="38" r="17" {...common} />
        <path d="M32 21c0-6 3-10 8-12" {...common} />
      </svg>
    );
  }

  if (kind === "dairy") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M32 8c-10 0-18 16-18 30a18 18 0 0 0 36 0C50 24 42 8 32 8z"
          {...common}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M12 52C12 28 26 12 54 10c0 28-14 42-38 42z" {...common} />
      <path d="M12 52C24 38 34 28 46 20" {...common} />
    </svg>
  );
}

export default function ProductImage({ product, className = "" }) {
  const [failed, setFailed] = useState(false);

  const imageUrl =
    product.imageUrl ||
    PRODUCT_IMAGES[product.name];

  if (imageUrl && !failed) {
    return (
      <img
        className={`pimg ${className}`}
        src={imageUrl}
        alt={product.name}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  const kind = kindFor(product.categoryName);

  return (
    <div
      className={`pimg pimg--fallback pimg--${kind} ${className}`}
      role="img"
      aria-label={product.name}
    >
      <Glyph kind={kind} />
    </div>
  );
}
