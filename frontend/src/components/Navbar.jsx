import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="GreenHarvest home">
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="currentColor" />
        <path d="M9 22c0-8 5-13 14-13 0 9-5 14-13 14z" fill="var(--wheat)" />
        <path d="M9 23c4-5 7-8 11-11" stroke="var(--leaf)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
      <span>GreenHarvest</span>
    </Link>
  );
}

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="nav">
      <div className="container nav__bar">
        <Logo />
        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav id="main-menu" className={`nav__menu${open ? " is-open" : ""}`} aria-label="Main">
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {user && <NavLink to="/orders">My orders</NavLink>}
          {isAdmin && <NavLink to="/admin">Admin</NavLink>}
          <NavLink to="/cart" className="nav__cart">
            Cart
            <span className="nav__count" aria-label={`${count} items in cart`}>{count}</span>
          </NavLink>
          {user ? (
            <span className="nav__user">
              <span className="nav__hello">Hi, {user.fullName.split(" ")[0]}</span>
              <button type="button" className="btn btn--ghost btn--small" onClick={handleLogout}>
                Log out
              </button>
            </span>
          ) : (
            <span className="nav__user">
              <Link to="/login" className="btn btn--ghost btn--small">Log in</Link>
              <Link to="/register" className="btn btn--primary btn--small">Sign up</Link>
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
