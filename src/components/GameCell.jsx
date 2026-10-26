export function GameCell({ index, row, column, value, isWinning, disabled, onClick }) {
  const label = value
    ? `Row ${row + 1}, column ${column + 1}, ${value}`
    : `Row ${row + 1}, column ${column + 1}, empty`;

  return (
    <button
      type="button"
      className={`cell${value ? ` cell-${value.toLowerCase()}` : ''}${isWinning ? ' cell-winning' : ''}`}
      aria-label={label}
      aria-pressed={Boolean(value)}
      disabled={disabled}
      onClick={() => onClick(index)}
    >
      {value}
    </button>
  );
}
