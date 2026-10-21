import api from "./client.js";

const data = (promise) => promise.then((res) => res.data);

export const authApi = {
  register: (body) => data(api.post("/auth/register", body)),
  login: (body) => data(api.post("/auth/login", body)),
  me: () => data(api.get("/auth/me")),
};

export const shopApi = {
  products: (params) => data(api.get("/products", { params })),
  product: (id) => data(api.get(`/products/${id}`)),
  categories: () => data(api.get("/categories")),
};

export const orderApi = {
  place: (body) => data(api.post("/orders", body)),
  mine: () => data(api.get("/orders/my")),
  cancel: (id) => data(api.post(`/orders/${id}/cancel`)),
};

export const adminApi = {
  dashboard: () => data(api.get("/admin/dashboard")),
  products: () => data(api.get("/admin/products")),
  createProduct: (body) => data(api.post("/admin/products", body)),
  updateProduct: (id, body) => data(api.put(`/admin/products/${id}`, body)),
  updateStock: (id, stockQuantity) => data(api.patch(`/admin/products/${id}/stock`, { stockQuantity })),
  deleteProduct: (id) => data(api.delete(`/admin/products/${id}`)),
  createCategory: (body) => data(api.post("/admin/categories", body)),
  updateCategory: (id, body) => data(api.put(`/admin/categories/${id}`, body)),
  deleteCategory: (id) => data(api.delete(`/admin/categories/${id}`)),
  orders: (status) => data(api.get("/admin/orders", { params: status ? { status } : undefined })),
  updateOrderStatus: (id, status) => data(api.put(`/admin/orders/${id}/status`, { status })),
};
