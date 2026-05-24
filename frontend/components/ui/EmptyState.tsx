interface EmptyStateProps {
  icon?: string;
  message?: string;
}

export function EmptyState({
  icon = '📭',
  message = 'No data available',
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-icon">{icon}</span>
      <p className="empty-text">{message}</p>
    </div>
  );
}
