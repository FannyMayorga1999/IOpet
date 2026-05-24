interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
}

export function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <div className="stat-card">
      {icon && <span className="stat-icon">{icon}</span>}
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
