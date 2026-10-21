export default function QuantityStepper({ value, max, onChange, label = "Quantity" }) {
  const set = (n) => onChange(Math.max(1, Math.min(max, n)));
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => set(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        −
      </button>
      <input
        type="number"
        min="1"
        max={max}
        value={value}
        onChange={(e) => set(Number(e.target.value) || 1)}
        aria-label={label}
      />
      <button type="button" onClick={() => set(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
