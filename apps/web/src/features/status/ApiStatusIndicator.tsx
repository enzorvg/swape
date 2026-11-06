import { useApiHealth } from './api';

export function ApiStatusIndicator() {
  const { data, isPending, isError } = useApiHealth();

  if (isPending) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-muted shadow-soft"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-border" />
        <span>Vérification de l'API...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="inline-flex items-center gap-2 rounded-full border border-danger bg-surface px-3 py-1 text-xs font-medium text-danger shadow-soft"
      >
        <span className="h-2 w-2 rounded-full bg-danger" />
        <span>API indisponible</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-full border border-primary bg-surface px-3 py-1 text-xs font-medium text-primary-deep shadow-soft"
    >
      <span className="h-2 w-2 rounded-full bg-primary" />
      <span>API : ok{data.version ? ` (v${data.version})` : ''}</span>
    </div>
  );
}
