import { useState } from "react";
import Field from "../../components/Field.jsx";
import { Empty, ErrorBox, Loading } from "../../components/StatusMessage.jsx";
import { useToast } from "../../components/Toast.jsx";
import useFetch from "../../hooks/useFetch.js";
import { adminApi, shopApi } from "../../api/index.js";
import { getErrorMessage, getFieldErrors } from "../../api/client.js";
import { formatPrice } from "../../utils/format.js";

const EMPTY = { name: "", description: "", price: "", unit: "kg", stockQuantity: "", imageUrl: "", categoryId: "", active: true };

function ProductForm({ product, categories, onSaved, onCancel }) {
  const toast = useToast();
  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          description: product.description || "",
          price: String(product.price),
          unit: product.unit,
          stockQuantity: String(product.stockQuantity),
          imageUrl: product.imageUrl || "",
          categoryId: String(product.categoryId),
          active: product.active,
        }
      : { ...EMPTY, categoryId: categories[0] ? String(categories[0].id) : "" }
  );
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setErrors({});
    const payload = {
      name: form.name,
      description: form.description,
      price: form.price === "" ? null : Number(form.price),
      unit: form.unit,
      stockQuantity: form.stockQuantity === "" ? null : Number(form.stockQuantity),
      imageUrl: form.imageUrl,
      categoryId: form.categoryId === "" ? null : Number(form.categoryId),
      active: form.active,
    };
    try {
      if (product) await adminApi.updateProduct(product.id, payload);
      else await adminApi.createProduct(payload);
      toast.show(product ? "Product updated" : "Product created");
      onSaved();
    } catch (err) {
      setErrors(getFieldErrors(err));
      setMessage(getErrorMessage(err, "Could not save the product."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form panel" onSubmit={submit} noValidate>
      <h2>{product ? `Edit ${product.name}` : "Add a product"}</h2>
      {message && <p className="notice notice--error" role="alert">{message}</p>}
      <div className="form__grid">
        <Field id="name" label="Name" value={form.name} onChange={change} error={errors.name} />
        <Field id="categoryId" as="select" label="Category" value={form.categoryId} onChange={change} error={errors.categoryId}>
          <option value="" disabled>Choose a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Field>
        <Field id="price" type="number" step="0.01" min="0" label="Price (₹)" value={form.price} onChange={change} error={errors.price} />
        <Field id="unit" label="Unit" hint="kg, dozen, litre, bunch…" value={form.unit} onChange={change} error={errors.unit} />
        <Field id="stockQuantity" type="number" min="0" label="Stock quantity" value={form.stockQuantity} onChange={change} error={errors.stockQuantity} />
        <Field id="imageUrl" label="Image URL (optional)" hint="Starts with https:// or /" value={form.imageUrl} onChange={change} error={errors.imageUrl} />
      </div>
      <Field id="description" as="textarea" rows={3} label="Description" value={form.description} onChange={change} error={errors.description} />
      <label className="check">
        <input type="checkbox" name="active" checked={form.active} onChange={change} />
        Show this product in the shop
      </label>
      <div className="form__actions">
        <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? "Saving…" : "Save product"}</button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function StockCell({ product, onSaved }) {
  const toast = useToast();
  const [value, setValue] = useState(String(product.stockQuantity));
  const [busy, setBusy] = useState(false);
  const changed = value !== String(product.stockQuantity);

  const save = async () => {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 0) {
      toast.show("Stock must be a whole number, 0 or more", "error");
      return;
    }
    setBusy(true);
    try {
      await adminApi.updateStock(product.id, n);
      toast.show("Stock updated");
      onSaved();
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stock-cell">
      <input type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)} aria-label={`Stock for ${product.name}`} />
      <button type="button" className="btn btn--ghost btn--small" onClick={save} disabled={!changed || busy}>
        Save
      </button>
    </div>
  );
}

export default function AdminProducts() {
  const toast = useToast();
  const products = useFetch(() => adminApi.products(), []);
  const categories = useFetch(() => shopApi.categories(), []);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, product = edit

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      const res = await adminApi.deleteProduct(p.id);
      toast.show(res.message);
      products.reload();
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
    }
  };

  const saved = () => {
    setEditing(null);
    products.reload();
  };

  if (products.loading || categories.loading) return <Loading label="Loading products…" />;
  if (products.error) return <ErrorBox message={products.error} onRetry={products.reload} />;
  if (categories.error) return <ErrorBox message={categories.error} onRetry={categories.reload} />;

  return (
    <>
      <div className="section__head">
        <h2>Products ({products.data.length})</h2>
        {!editing && (
          <button type="button" className="btn btn--primary" onClick={() => setEditing({})} disabled={categories.data.length === 0}>
            Add product
          </button>
        )}
      </div>
      {categories.data.length === 0 && <p className="notice">Create a category first, then you can add products.</p>}

      {editing && (
        <ProductForm
          key={editing.id || "new"}
          product={editing.id ? editing : null}
          categories={categories.data}
          onSaved={saved}
          onCancel={() => setEditing(null)}
        />
      )}

      {products.data.length === 0 ? (
        <Empty title="No products yet" />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Category</th>
                <th scope="col">Price</th>
                <th scope="col">Stock</th>
                <th scope="col">Shop</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {products.data.map((p) => (
                <tr key={p.id}>
                  <th scope="row">{p.name}</th>
                  <td>{p.categoryName}</td>
                  <td>{formatPrice(p.price)} / {p.unit}</td>
                  <td><StockCell key={`${p.id}-${p.stockQuantity}`} product={p} onSaved={products.reload} /></td>
                  <td><span className={`badge ${p.active ? "badge--delivered" : "badge--cancelled"}`}>{p.active ? "Visible" : "Hidden"}</span></td>
                  <td className="table__actions">
                    <button type="button" className="btn btn--ghost btn--small" onClick={() => setEditing(p)}>Edit</button>
                    <button type="button" className="btn btn--danger btn--small" onClick={() => remove(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
