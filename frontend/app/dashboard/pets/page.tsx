'use client';

import { Layout } from '@/components/Layout/Layout';
import { PetCard } from '@/components/Pets/PetCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePets } from '@/hooks/usePets';
import { useMobile } from '@/hooks/useMobile';
import { useTranslation } from '@/hooks/useTranslation';

export default function MascotasPage() {
  const { data: pets, loading, error, refetch } = usePets();
  const isMobile = useMobile();
  const { t } = useTranslation();
  const m = (cls: string) => isMobile ? `${cls} ${cls}__mobile` : cls;

  return (
    <Layout>
      <div className={m('pets-page')}>
        <div>
          <h1>{t('pets.title')}</h1>
          <p className={m('subtitle')}>{t('pets.subtitle')}</p>
        </div>

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
        ) : !pets || pets.length === 0 ? (
          <EmptyState icon="🐾" message={t('pets.noPets')} />
        ) : (
          <div className={m('pets-grid')}>
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
