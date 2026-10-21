import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const KEY = "gh_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((i) => i && i.id && i.quantity > 0) : [];
  } catch {
    return [];
  }
}

/**
 * The cart lives in the browser. Prices shown here are only for display:
 * the server recalculates every price and the total when the order is placed.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = useCallback((product, qty = 1) => {
    setItems((prev) => {
      const snapshot = {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        stockQuantity: product.stockQuantity,
        imageUrl: product.imageUrl,
        categoryName: product.categoryName,
      };
      const max = product.stockQuantity;
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, ...snapshot, quantity: Math.min(i.quantity + qty, max) } : i
        );
      }
      return [...prev, { ...snapshot, quantity: Math.min(qty, max) }];
    });
  }, []);

  const setQuantity = useCallback((id, quantity) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const q = Math.max(1, Math.min(Number(quantity) || 1, i.stockQuantity));
        return { ...i, quantity: q };
      })
    );
  }, []);

  const remove = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const cents = items.reduce((n, i) => n + Math.round(i.price * 100) * i.quantity, 0);
    return { items, count, subtotal: cents / 100, add, setQuantity, remove, clear };
  }, [items, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
