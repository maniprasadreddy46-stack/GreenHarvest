import { useState } from "react";
import Field from "../../components/Field.jsx";
import { Empty, ErrorBox, Loading } from "../../components/StatusMessage.jsx";
import { useToast } from "../../components/Toast.jsx";
import useFetch from "../../hooks/useFetch.js";
import { adminApi, shopApi } from "../../api/index.js";
import { getErrorMessage, getFieldErrors } from "../../api/client.js";

function CategoryForm({ category, onSaved, onCancel }) {
  const toast = useToast();
  const [form, setForm] = useState({ name: category?.name || "", description: category?.description || "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setErrors({});
    try {
      if (category) await adminApi.updateCategory(category.id, form);
      else await adminApi.createCategory(form);
      toast.show(category ? "Category updated" : "Category created");
      onSaved();
    } catch (err) {
      setErrors(getFieldErrors(err));
      setMessage(getErrorMessage(err, "Could not save the category."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form panel" onSubmit={submit} noValidate>
      <h2>{category ? `Edit ${category.name}` : "Add a category"}</h2>
      {message && <p className="notice notice--error" role="alert">{message}</p>}
      <Field id="name" label="Name" value={form.name} onChange={change} error={errors.name} />
      <Field id="description" label="Description (optional)" value={form.description} onChange={change} error={errors.description} />
      <div className="form__actions">
        <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? "Saving…" : "Save category"}</button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function AdminCategories() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => shopApi.categories(), []);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, category = edit

  const remove = async (c) => {
    if (!window.confirm(`Delete the category "${c.name}"?`)) return;
    try {
      const res = await adminApi.deleteCategory(c.id);
      toast.show(res.message);
      reload();
    } catch (err) {
      toast.show(getErrorMessage(err), "error");
    }
  };

  const saved = () => {
    setEditing(null);
    reload();
  };

  if (loading) return <Loading label="Loading categories…" />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <>
      <div className="section__head">
        <h2>Categories ({data.length})</h2>
        {!editing && (
          <button type="button" className="btn btn--primary" onClick={() => setEditing({})}>Add category</button>
        )}
      </div>

      {editing && (
        <CategoryForm
          key={editing.id || "new"}
          category={editing.id ? editing : null}
          onSaved={saved}
          onCancel={() => setEditing(null)}
        />
      )}

      {data.length === 0 ? (
        <Empty title="No categories yet" />
      ) : (
        <ul className="rows">
          {data.map((c) => (
            <li key={c.id} className="rows__item">
              <div>
                <strong>{c.name}</strong>
                {c.description && <p className="muted small">{c.description}</p>}
              </div>
              <div className="table__actions">
                <button type="button" className="btn btn--ghost btn--small" onClick={() => setEditing(c)}>Edit</button>
                <button type="button" className="btn btn--danger btn--small" onClick={() => remove(c)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
