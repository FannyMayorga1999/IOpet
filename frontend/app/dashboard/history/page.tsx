'use client';

import { Layout } from '@/components/Layout/Layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useFeedingHistory } from '@/hooks/useFeedingHistory';
import { useMobile } from '@/hooks/useMobile';
import { useTranslation } from '@/hooks/useTranslation';
import type { FeedingSchedule } from '@/interfaces/feedingSchedule';

function formatDate(iso: string, compact?: boolean): string {
  const d = new Date(iso);
  if (compact) {
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const statusIcon: Record<FeedingSchedule['status'], string> = {
  completed: '✅',
  pending: '⏳',
  missed: '❌',
};

function StatusBadge({ status }: { status: FeedingSchedule['status'] }) {
  return <span className={`status-badge ${status}`}>{status}</span>;
}

export default function HistoryPage() {
  const { data: schedules, loading, error, refetch } = useFeedingHistory();
  const isMobile = useMobile();
  const { t } = useTranslation();
  const m = (cls: string) => isMobile ? `${cls} ${cls}__mobile` : cls;

  return (
    <Layout>
      <div className={m('history-page')}>
        <div>
          <h1>{t('history.title')}</h1>
          <p className={m('subtitle')}>{t('history.subtitle')}</p>
        </div>

        <div className={m('history-table-wrapper')}>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className={m('empty-state')}>
              <span className={m('empty-icon')}>⚠️</span>
              <p className={m('empty-text')}>{error}</p>
              <button
                onClick={refetch}
                style={{
                  marginTop: 8,
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-primary)',
                  background: 'transparent',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                }}
              >
                {t('common.retry')}
              </button>
            </div>
          ) : !schedules || schedules.length === 0 ? (
            <EmptyState icon="🍽️" message={t('history.noHistory')} />
          ) : (
            <table className={m('history-table')}>
              <thead>
                <tr className={m('history-header-row')}>
                  <th className={m('history-th')} data-label="ID">{t('history.table.petId')}</th>
                  <th className={m('history-th')} data-label="Food">{t('history.table.food')}</th>
                  <th className={m('history-th')} data-label="Portion">{t('history.table.portion')}</th>
                  <th className={m('history-th')} data-label="Scheduled">{t('history.table.scheduled')}</th>
                  <th className={m('history-th')} data-label="Completed">{t('history.table.completed')}</th>
                  <th className={m('history-th')} data-label="Status">{t('history.table.status')}</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td className={m('history-td')} data-label="🆔">{schedule.petId.slice(0, 8)}...</td>
                    <td className={m('history-td')} data-label="🍖">{schedule.foodType}</td>
                    <td className={m('history-td')} data-label="⚖️">{schedule.portionSize}</td>
                    <td className={m('history-td')} data-label="🕐">{formatDate(schedule.scheduledTime, isMobile)}</td>
                    <td className={m('history-td')} data-label="✅">
                      {schedule.completedTime
                        ? formatDate(schedule.completedTime, isMobile)
                        : '—'}
                    </td>
                    <td className={m('history-td')} data-label="📌">
                      {isMobile ? (
                        <span className={`status-icon ${schedule.status}`}>{statusIcon[schedule.status]}</span>
                      ) : (
                        <StatusBadge status={schedule.status} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
