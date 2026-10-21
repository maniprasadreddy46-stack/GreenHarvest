import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle.js";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <div className="container page">
      <div className="status status--empty">
        <h1>We could not find that page</h1>
        <p>The address may be wrong, or the page has moved.</p>
        <Link to="/" className="btn btn--primary">Go to the home page</Link>
      </div>
    </div>
  );
}
