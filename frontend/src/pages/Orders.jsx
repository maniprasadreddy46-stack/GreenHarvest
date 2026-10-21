
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Empty, ErrorBox, Loading } from "../components/StatusMessage.jsx";
import { useToast } from "../components/Toast.jsx";
import useFetch from "../hooks/useFetch.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { orderApi } from "../api/index.js";
import { getErrorMessage } from "../api/client.js";
import {
  STATUS_LABELS,
  formatDate,
  formatPrice,
} from "../utils/format.js";

export default function Orders() {
  usePageTitle("My orders");

  const location = useLocation();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(
    () => orderApi.mine(),
    []
  );

  const [busyId, setBusyId] = useState(null);
  const placedId = location.state?.placedOrderId;

  const cancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    setBusyId(id);

    try {
      await orderApi.cancel(id);
      toast.show("Order cancelled");
      reload();
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="container page">
      <h1>My orders</h1>

      {placedId && (
        <p className="notice" role="status">
          Demo order #{placedId} was placed. No payment was taken
          and nothing will be delivered.
        </p>
      )}

      {loading && <Loading label="Loading your orders…" />}

      {error && <ErrorBox message={error} onRetry={reload} />}

      {data && data.length === 0 && (
        <Empty title="You have not placed any orders yet">
          <Link to="/shop" className="btn btn--primary">
            Start shopping
          </Link>
        </Empty>
      )}

      {data && data.length > 0 && (
        <ul className="orders">
          {data.map((o) => {
            const customerName =
              o.customerName ??
              o.fullName ??
              o.name ??
              o.user?.fullName ??
              o.user?.name;

            const phoneNumber =
              o.phoneNumber ??
              o.phone ??
              o.mobileNumber ??
              o.user?.phoneNumber ??
              o.user?.phone;

            const address =
              o.deliveryAddress ??
              o.address ??
              o.shippingAddress;

            return (
              <li key={o.id} className="order">
                <header className="order__head">
                  <div>
                    <h2>Order #{o.id}</h2>
                    <p className="muted small">
                      {formatDate(o.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`badge badge--${(
                      o.status || "PLACED"
                    ).toLowerCase()}`}
                  >
                    {STATUS_LABELS[o.status] || o.status || "Placed"}
                  </span>
                </header>

                <section className="order__customer">
                  <h3>Customer details</h3>

                  <p>
                    <strong>Name:</strong>{" "}
                    {customerName || "Not available"}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {phoneNumber || "Not available"}
                  </p>

                  <p>
                    <strong>Delivery address:</strong>{" "}
                    {address || "Not available"}
                  </p>
                </section>

                <ul className="order__items">
                  {(o.items || []).map((item, index) => (
                    <li
                      key={item.productId ?? item.id ?? index}
                    >
                      <span>
                        {item.quantity} × {item.productName}
                      </span>

                      <span>{formatPrice(item.lineTotal)}</span>
                    </li>
                  ))}
                </ul>

                <footer className="order__foot">
                  <p className="order__total">
                    Total {formatPrice(o.totalAmount)}
                  </p>

                  {o.status === "PLACED" && (
                    <button
                      type="button"
                      className="btn btn--ghost btn--small"
                      disabled={busyId === o.id}
                      onClick={() => cancel(o.id)}
                    >
                      {busyId === o.id
                        ? "Cancelling…"
                        : "Cancel order"}
                    </button>
                  )}
                </footer>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

