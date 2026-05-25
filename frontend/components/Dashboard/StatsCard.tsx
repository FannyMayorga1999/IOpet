interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: { value: string; positive: boolean };
}

export function StatsCard({ label, value, icon, trend }: StatsCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-icon">{icon}</span>
        {trend && (
          <span className={`stat-trend ${trend.positive ? 'stat-trend--up' : 'stat-trend--down'}`}>
            <svg viewBox="0 0 24 24" width="14" height="14">
              {trend.positive ? (
                <polyline points="18 15 12 9 6 15" />
              ) : (
                <polyline points="6 9 12 15 18 9" />
              )}
            </svg>
            {trend.value}
          </span>
        )}
      </div>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
