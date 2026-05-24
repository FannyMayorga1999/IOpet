'use client';

import { Layout } from '@/components/Layout/Layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useFeedingHistory } from '@/hooks/useFeedingHistory';
import type { FeedingSchedule } from '@/interfaces/feedingSchedule';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: FeedingSchedule['status'] }) {
  return <span className={`status-badge ${status}`}>{status}</span>;
}

export default function HistorialPage() {
  const { data: schedules, loading, error, refetch } = useFeedingHistory();

  return (
    <Layout>
      <div className="historial-page">
        <div>
          <h1>Feeding History</h1>
          <p className="subtitle">Complete record of all feeding schedules.</p>
        </div>

        <div className="historial-table-wrapper">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="empty-state">
              <span className="empty-icon">⚠️</span>
              <p className="empty-text">{error}</p>
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
                Retry
              </button>
            </div>
          ) : !schedules || schedules.length === 0 ? (
            <EmptyState icon="🍽️" message="No feeding schedules found" />
          ) : (
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Pet ID</th>
                  <th>Food</th>
                  <th>Portion</th>
                  <th>Scheduled</th>
                  <th>Completed</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.petId.slice(0, 8)}...</td>
                    <td>{schedule.foodType}</td>
                    <td>{schedule.portionSize}</td>
                    <td>{formatDate(schedule.scheduledTime)}</td>
                    <td>
                      {schedule.completedTime
                        ? formatDate(schedule.completedTime)
                        : '—'}
                    </td>
                    <td>
                      <StatusBadge status={schedule.status} />
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
