/**
 * A label + input (or select / textarea) + optional hint + error text.
 * <Field id="phone" label="Phone" error={errors.phone} value={...} onChange={...} />
 * Use as="select" or as="textarea" for other controls.
 */
export default function Field({ id, label, error, hint, as: Tag = "input", children, ...rest }) {
  const describedBy =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <Tag id={id} name={id} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest}>
        {children}
      </Tag>
      {hint && (
        <small className="hint" id={`${id}-hint`}>
          {hint}
        </small>
      )}
      {error && (
        <small className="error-text" id={`${id}-error`}>
          {error}
        </small>
      )}
    </div>
  );
}
