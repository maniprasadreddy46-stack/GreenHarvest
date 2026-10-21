import { useState } from "react";
import { Empty, ErrorBox, Loading } from "../../components/StatusMessage.jsx";
import { useToast } from "../../components/Toast.jsx";
import useFetch from "../../hooks/useFetch.js";
import { adminApi } from "../../api/index.js";
import { getErrorMessage } from "../../api/client.js";
import { ORDER_STATUSES, STATUS_LABELS, formatDate, formatPrice } from "../../utils/format.js";

export default function AdminOrders() {
  const toast = useToast();
  const [filter, setFilter] = useState("");
  const { data, loading, error, reload } = useFetch(() => adminApi.orders(filter), [filter]);
  const [busyId, setBusyId] = useState(null);

  const changeStatus = async (order, status) => {
    if (status === order.status) return;
    if (status === "CANCELLED" && !window.confirm(`Cancel order #${order.id}? Its stock will be returned to the shop.`)) return;
    setBusyId(order.id);
    try {
      await adminApi.updateOrderStatus(order.id, status);
      toast.show(`Order #${order.id} is now ${STATUS_LABELS[status]}`);
      reload();
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
      reload();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <div className="section__head">
        <h2>Orders</h2>
        <div className="inline-field">
          <label htmlFor="filter">Show</label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All orders</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <Loading label="Loading orders…" />}
      {error && <ErrorBox message={error} onRetry={reload} />}
      {data && data.length === 0 && <Empty title="No orders found" />}

      {data && data.length > 0 && (
        <ul className="orders">
          {data.map((o) => {
            const final = o.status === "DELIVERED" || o.status === "CANCELLED";
            return (
              <li key={o.id} className="order">
                <header className="order__head">
                  <div>
                    <h3>Order #{o.id}</h3>
                    <p className="muted small">{formatDate(o.createdAt)}</p>
                  </div>
                  <span className={`badge badge--${o.status.toLowerCase()}`}>{STATUS_LABELS[o.status]}</span>
                </header>
                <p className="small">
                  <strong>{o.customerName}</strong> · {o.phone} · {o.customerEmail}
                  <br />
                  {o.deliveryAddress}
                </p>
                <ul className="order__items">
                  {o.items.map((i) => (
                    <li key={i.productId}>
                      <span>{i.quantity} × {i.productName}</span>
                      <span>{formatPrice(i.lineTotal)}</span>
                    </li>
                  ))}
                </ul>
                <footer className="order__foot">
                  <p className="order__total">Total {formatPrice(o.totalAmount)}</p>
                  <div className="inline-field">
                    <label htmlFor={`status-${o.id}`}>Status</label>
                    <select
                      id={`status-${o.id}`}
                      value={o.status}
                      disabled={final || busyId === o.id}
                      onChange={(e) => changeStatus(o, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                </footer>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
