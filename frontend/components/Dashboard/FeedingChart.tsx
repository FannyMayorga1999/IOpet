'use client';

import { useTranslation } from '@/hooks/useTranslation';
import type { FeedingSchedule } from '@/interfaces/feedingSchedule';

interface FeedingChartProps {
  schedules: FeedingSchedule[];
}

export function FeedingChart({ schedules }: FeedingChartProps) {
  const { t } = useTranslation();

  const completed = schedules.filter((s) => s.status === 'completed').length;
  const pending = schedules.filter((s) => s.status === 'pending').length;
  const missed = schedules.filter((s) => s.status === 'missed').length;
  const total = schedules.length || 1;

  const completedPct = Math.round((completed / total) * 100);
  const pendingPct = Math.round((pending / total) * 100);
  const missedPct = Math.round((missed / total) * 100);

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>{t('dashboard.feedingChart.title')}</h3>
        <span>{t('dashboard.feedingChart.lastDays')}</span>
      </div>

      {/* Stacked bar */}
      <div className="feeding-bar">
        {completed > 0 && (
          <div
            className="feeding-bar-segment feeding-bar--completed"
            style={{ width: `${completedPct}%` }}
            title={`${t('dashboard.feedingChart.completed')}: ${completed}`}
          />
        )}
        {pending > 0 && (
          <div
            className="feeding-bar-segment feeding-bar--pending"
            style={{ width: `${pendingPct}%` }}
            title={`${t('dashboard.feedingChart.pending')}: ${pending}`}
          />
        )}
        {missed > 0 && (
          <div
            className="feeding-bar-segment feeding-bar--missed"
            style={{ width: `${missedPct}%` }}
            title={`${t('dashboard.feedingChart.missed')}: ${missed}`}
          />
        )}
      </div>

      {/* Stats circles */}
      <div className="feeding-stats">
        <div className="feeding-stat">
          <span className="feeding-stat-value feeding-stat-value--completed">{completed}</span>
          <span className="feeding-stat-label">{t('dashboard.feedingChart.completed')}</span>
          <span className="feeding-stat-pct">{completedPct}%</span>
        </div>
        <div className="feeding-stat">
          <span className="feeding-stat-value feeding-stat-value--pending">{pending}</span>
          <span className="feeding-stat-label">{t('dashboard.feedingChart.pending')}</span>
          <span className="feeding-stat-pct">{pendingPct}%</span>
        </div>
        <div className="feeding-stat">
          <span className="feeding-stat-value feeding-stat-value--missed">{missed}</span>
          <span className="feeding-stat-label">{t('dashboard.feedingChart.missed')}</span>
          <span className="feeding-stat-pct">{missedPct}%</span>
        </div>
      </div>

      {/* Total */}
      <div className="feeding-total">
        <span>{t('dashboard.feedingChart.total')}</span>
        <strong>{schedules.length}</strong>
      </div>
    </div>
  );
}
