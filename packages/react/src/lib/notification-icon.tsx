const statusPaths: Record<string, string> = {
  success: 'm5 10 3 3 7-7',
  error: 'm6 6 8 8m0-8-8 8',
  warning: 'M10 5v6m0 3v1',
  info: 'M10 9v6m0-10v1',
};

export function NotificationIcon({ type }: { type: string | undefined }) {
  const path = type && statusPaths[type];
  if (!path) return null;
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="hx-notification-icon shrink-0"
    >
      <circle cx="10" cy="10" r="8" />
      <path d={path} />
    </svg>
  );
}
