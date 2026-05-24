'use client';

import { Layout } from '@/components/Layout/Layout';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { usePets } from '@/hooks/usePets';
import { useFeedingHistory } from '@/hooks/useFeedingHistory';

export default function DashboardPage() {
  const { data: pets } = usePets();
  const { data: schedules } = useFeedingHistory();

  const totalPets = pets?.length ?? 0;
  const todayFeedings = schedules?.length ?? 0;
  const pending = schedules?.filter((s) => s.status === 'pending').length ?? 0;
  const completed = schedules?.filter((s) => s.status === 'completed').length ?? 0;

  return (
    <Layout>
      <div className="dashboard">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to ioPet — manage your pets and feeding schedules.</p>
        </div>
        <div className="stats-grid">
          <StatsCard label="Total Pets" value={totalPets} icon="🐕" />
          <StatsCard label="Feedings Today" value={todayFeedings} icon="🍽️" />
          <StatsCard label="Pending" value={pending} icon="⏳" />
          <StatsCard label="Completed" value={completed} icon="✅" />
        </div>
      </div>
    </Layout>
  );
}
