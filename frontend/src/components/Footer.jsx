import { Link } from "react-router-dom";
import { Logo } from "./Navbar.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Logo />
          <p className="footer__blurb">
            A small organic farm selling what it grows, straight to the people who eat it.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2>Explore</h2>
          <ul>
            <li><Link to="/shop">Shop the harvest</Link></li>
            <li><Link to="/about">About the farm</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/orders">Track an order</Link></li>
          </ul>
        </nav>
        <div>
          <h2>Visit</h2>
          <address>
            GreenHarvest Farm<br />
            Farm Road, Your District, India<br />
            hello@greenharvest.example
          </address>
        </div>
      </div>
      <div className="container footer__legal">
        <p>© {new Date().getFullYear()} GreenHarvest. College project: orders are a demo, no payment is taken and nothing is delivered.</p>
      </div>
    </footer>
  );
}
