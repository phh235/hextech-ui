export interface OptionIdentity<T> {
  getOptionKey?: ((option: T) => string | number) | undefined;
  getOptionLabel?: ((option: T) => string) | undefined;
}
/** Stable identity and labels for immutable API records, independent of React. */
export function createOptionModel<T>(options: readonly T[], identity: OptionIdentity<T> = {}) {
  function key(value: T): string {
    const selected =
      identity.getOptionKey?.(value) ??
      (typeof value === 'object' && value !== null
        ? 'id' in value
          ? value.id
          : 'value' in value
            ? value.value
            : undefined
        : value);
    if (
      (typeof selected !== 'string' && typeof selected !== 'number') ||
      String(selected) === '' ||
      (typeof selected === 'number' && !Number.isFinite(selected))
    ) {
      throw new Error(
        'Options need a nonempty string/number key. Provide getOptionKey for object records.',
      );
    }
    return String(selected);
  }
  function readLabel(value: T): string {
    const text =
      identity.getOptionLabel?.(value) ??
      (typeof value === 'object' && value !== null && 'label' in value
        ? value.label
        : typeof value === 'string' || typeof value === 'number'
          ? String(value)
          : undefined);
    if (typeof text !== 'string' || !text.trim())
      throw new Error(
        'Options need a readable label. Provide itemToStringLabel (or itemToStringValue for Autocomplete).',
      );
    return text;
  }
  const byKey = new Map<string, T>();
  for (const option of options) {
    const id = key(option);
    if (byKey.has(id)) throw new Error(`Duplicate option key: ${id}`);
    readLabel(option);
    byKey.set(id, option);
  }
  const resolve = (value: T) => byKey.get(key(value)) ?? value;
  return {
    key,
    resolve,
    label: (value: T) => readLabel(resolve(value)),
    equal: (a: T, b: T) => Object.is(a, b) || key(a) === key(b),
  };
}
