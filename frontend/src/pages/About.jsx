import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle.js";

export default function About() {
  usePageTitle("About");
  return (
    <div className="container page prose">
      <h1>About GreenHarvest</h1>
      <p className="lead-sm">
        GreenHarvest started as a family plot with a handful of vegetable beds. Today it is a small organic
        farm that grows vegetables, fruit, grains and pulses, and keeps hens and cows on open pasture.
      </p>

      <h2>How we farm</h2>
      <p>
        We feed the soil with compost and green manure, rotate crops every season and weed by hand. We do not
        use synthetic pesticides or chemical fertilisers. Fruit is ripened on the tree, never with chemicals.
      </p>

      <h2>How you buy</h2>
      <p>
        Browse the shop, add what you need to your cart and place an order. We pack to order in small batches,
        so stock levels you see on the site are real.
      </p>

      <h2>About this project</h2>
      <p>
        This website is a college project: GreenHarvest – Organic Farm Management &amp; E-Commerce System. It is
        built with React, Spring Boot and MySQL. Checkout is a demo order flow, so no payment is taken and no
        goods are delivered.
      </p>
      <p><Link to="/shop" className="btn btn--primary">Visit the shop</Link></p>
    </div>
  );
}
