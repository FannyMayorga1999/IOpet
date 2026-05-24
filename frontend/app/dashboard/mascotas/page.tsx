'use client';

import { Layout } from '@/components/Layout/Layout';
import { PetCard } from '@/components/Pets/PetCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePets } from '@/hooks/usePets';

export default function MascotasPage() {
  const { data: pets, loading, error, refetch } = usePets();

  return (
    <Layout>
      <div className="pets-page">
        <div>
          <h1>Mascotas</h1>
          <p className="subtitle">View and manage all registered pets.</p>
        </div>

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
        ) : !pets || pets.length === 0 ? (
          <EmptyState icon="🐾" message="No pets registered yet" />
        ) : (
          <div className="pets-grid">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
