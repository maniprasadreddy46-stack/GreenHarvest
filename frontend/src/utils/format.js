const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

export const formatPrice = (n) => inr.format(Number(n || 0));

export const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export const STATUS_LABELS = {
  PLACED: "Placed",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUSES = Object.keys(STATUS_LABELS);
