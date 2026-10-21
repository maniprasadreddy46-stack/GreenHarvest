import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { ErrorBox, Loading } from "../components/StatusMessage.jsx";
import useFetch from "../hooks/useFetch.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { shopApi } from "../api/index.js";

// Crop rows that grow once when the page opens (the single animated moment on this page).
function FieldIllustration() {
  const rows = [0, 1, 2, 3, 4];
  const plants = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <svg className="field" viewBox="0 0 520 440" role="img" aria-label="Illustration of crop rows under a morning sun">
      <circle cx="402" cy="92" r="46" fill="var(--wheat)" />
      <path d="M0 238 Q130 178 262 224 T520 204 V440 H0Z" fill="var(--sage)" />
      <path d="M0 292 Q160 244 300 282 T520 270 V440 H0Z" fill="var(--moss)" />
      {rows.map((r) => (
        <g key={r} transform={`translate(0 ${322 + r * 26})`}>
          <g className="field__row" style={{ animationDelay: `${r * 140}ms` }}>
            {plants.map((p) => {
              const x = 34 + p * 48 + (r % 2) * 24;
              return (
                <g key={p} transform={`translate(${x} 0)`}>
                  <path d="M0 0V-26" stroke="var(--leaf)" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="-8" cy="-19" rx="9" ry="4" transform="rotate(-30 -8 -19)" fill="var(--leaf)" />
                  <ellipse cx="8" cy="-26" rx="9" ry="4" transform="rotate(30 8 -26)" fill="var(--leaf)" />
                </g>
              );
            })}
          </g>
        </g>
      ))}
    </svg>
  );
}

const TESTIMONIALS = [
  {
    quote: "The tomatoes taste like the ones my grandmother grew. We stopped buying them anywhere else.",
    name: "Lakshmi R.",
    role: "Home cook",
  },
  {
    quote: "Ordering is simple and the eggs always arrive intact. The ghee is the best I have had in years.",
    name: "Suresh K.",
    role: "Regular customer",
  },
  {
    quote: "I like knowing which farm my food comes from. The produce stays fresh for days.",
    name: "Anitha M.",
    role: "Teacher",
  },
];

export default function Home() {
  usePageTitle("");
  const { data, loading, error, reload } = useFetch(() => shopApi.products(), []);

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__text">
            <h1>Grown on our rows. Eaten at your table.</h1>
            <p className="lead">
              GreenHarvest is a small organic farm. We grow vegetables, fruit, grains and dairy without
              synthetic pesticides, and sell them straight to you.
            </p>
            <div className="hero__actions">
              <Link to="/shop" className="btn btn--primary">Shop the harvest</Link>
              <Link to="/about" className="btn btn--ghost">How we farm</Link>
            </div>
          </div>
          <div className="hero__art">
            <FieldIllustration />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>This week’s harvest</h2>
            <Link to="/shop" className="link">See everything we sell</Link>
          </div>
          {loading && <Loading label="Loading the harvest…" />}
          {error && <ErrorBox message={error} onRetry={reload} />}
          {data && data.length === 0 && <p className="muted">Nothing is listed yet. Please check back soon.</p>}
          {data && data.length > 0 && (
            <div className="grid">
              {data.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--sage">
        <div className="container split">
          <div>
            <h2>Why people buy from the farm</h2>
            <p className="muted">
              Short supply chains mean fewer days between the field and your kitchen, and a fairer price
              for the people who grow your food.
            </p>
          </div>
          <ul className="values">
            <li>
              <h3>No synthetic pesticides</h3>
              <p>Compost, crop rotation and hand weeding keep our soil and our produce clean.</p>
            </li>
            <li>
              <h3>Sold direct</h3>
              <p>No middlemen. What you pay goes to the farm, and you can see exactly what is in stock.</p>
            </li>
            <li>
              <h3>Packed in small batches</h3>
              <p>We harvest according to orders, so little is wasted and everything arrives fresh.</p>
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>What our customers say</h2>
          <div className="quotes">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="quote">
                <blockquote>{t.quote}</blockquote>
                <figcaption>
                  {t.name}, <span className="muted">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="muted small">Sample testimonials written for this demo project.</p>
        </div>
      </section>

      <section className="section section--green">
        <div className="container cta">
          <h2>Questions about an order or a visit?</h2>
          <Link to="/contact" className="btn btn--wheat">Get in touch</Link>
        </div>
      </section>
    </>
  );
}
