import { NavLink, Outlet } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle.js";

export default function AdminLayout() {
  usePageTitle("Admin");
  return (
    <div className="container page admin">
      <h1>Farm admin</h1>
      <nav className="admin__tabs" aria-label="Admin sections">
        <NavLink to="/admin" end>Dashboard</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/categories">Categories</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
