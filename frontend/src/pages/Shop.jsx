import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { Empty, ErrorBox, Loading } from "../components/StatusMessage.jsx";
import useFetch from "../hooks/useFetch.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { shopApi } from "../api/index.js";

export default function Shop() {
  usePageTitle("Shop");
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const [text, setText] = useState(q);

  const categories = useFetch(() => shopApi.categories(), []);
  const products = useFetch(
    () => shopApi.products({ q: q || undefined, categoryId: category || undefined }),
    [q, category]
  );

  const setParam = (key, value) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );

  // Wait until the visitor stops typing before searching.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (text.trim() !== q) setParam("q", text.trim());
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Keep the box in step when the URL changes (browser back button).
  useEffect(() => {
    if (q !== text.trim()) setText(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const clearFilters = () => {
    setText("");
    setParams({}, { replace: true });
  };

  return (
    <div className="container page">
      <h1>Shop the harvest</h1>

      <div className="toolbar">
        <div className="toolbar__search">
          <label htmlFor="search">Search products</label>
          <input
            id="search"
            type="search"
            placeholder="Try tomatoes, ghee, honey…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="chips" role="group" aria-label="Filter by category">
          <button type="button" className="chip" aria-pressed={!category} onClick={() => setParam("category", "")}>
            All
          </button>
          {(categories.data || []).map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              aria-pressed={String(c.id) === category}
              onClick={() => setParam("category", String(c.id))}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {products.loading && <Loading label="Loading products…" />}
      {products.error && <ErrorBox message={products.error} onRetry={products.reload} />}

      {products.data && (
        <>
          <p className="muted small" aria-live="polite">
            {products.data.length} {products.data.length === 1 ? "product" : "products"} found
          </p>
          {products.data.length === 0 ? (
            <Empty title="No products match your search">
              <p>Try a different word or another category.</p>
              <button type="button" className="btn btn--ghost" onClick={clearFilters}>
                Clear filters
              </button>
            </Empty>
          ) : (
            <div className="grid">
              {products.data.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
