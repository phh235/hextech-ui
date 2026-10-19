/** Keep a visible indicator during a programmatic handoff, including mixed input. */
export function restoreFocus(element: HTMLElement | null | undefined) {
  if (!element) return;
  const marker = 'data-hextech-collection-focus';
  const clear = () => element.removeAttribute(marker);
  element.setAttribute(marker, '');
  element.addEventListener('blur', clear, { once: true });
  element.focus();
  if (!element.matches(':focus')) {
    clear();
    element.removeEventListener('blur', clear);
  }
}
