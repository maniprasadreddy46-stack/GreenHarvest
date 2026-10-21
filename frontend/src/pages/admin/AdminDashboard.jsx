import { Link } from "react-router-dom";
import { ErrorBox, Loading } from "../../components/StatusMessage.jsx";
import useFetch from "../../hooks/useFetch.js";
import { adminApi } from "../../api/index.js";
import { STATUS_LABELS, formatPrice } from "../../utils/format.js";

export default function AdminDashboard() {
  const { data, loading, error, reload } = useFetch(() => adminApi.dashboard(), []);

  if (loading) return <Loading label="Loading dashboard…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const stats = [
    { label: "Products", value: data.totalProducts, note: `${data.activeProducts} visible in the shop` },
    { label: "Low stock", value: data.lowStockProducts, note: "Fewer than 10 left" },
    { label: "Orders", value: data.totalOrders, note: "All time" },
    { label: "Customers", value: data.totalCustomers, note: "Registered accounts" },
    { label: "Revenue", value: formatPrice(data.revenue), note: "Excludes cancelled orders (demo, no payments)" },
  ];

  return (
    <>
      <dl className="stats">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
            <p className="muted small">{s.note}</p>
          </div>
        ))}
      </dl>

      <section className="panel">
        <h2>Orders by status</h2>
        <ul className="bars">
          {Object.entries(data.ordersByStatus).map(([status, count]) => {
            const pct = data.totalOrders ? Math.round((count / data.totalOrders) * 100) : 0;
            return (
              <li key={status}>
                <span className="bars__label">{STATUS_LABELS[status]}</span>
                <span className="bars__track" aria-hidden="true">
                  <span className={`bars__fill badge--${status.toLowerCase()}`} style={{ width: `${pct}%` }} />
                </span>
                <span className="bars__count">{count}</span>
              </li>
            );
          })}
        </ul>
        <p><Link to="/admin/orders" className="link">Manage orders</Link></p>
      </section>
    </>
  );
}
