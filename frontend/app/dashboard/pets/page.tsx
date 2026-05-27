'use client';

import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { PetCard } from '@/components/Pets/PetCard';
import { AddPetModal } from '@/components/Pets/AddPetModal';
import { EditPetModal } from '@/components/Pets/EditPetModal';
import { DeleteConfirmModal } from '@/components/Pets/DeleteConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePets } from '@/hooks/usePets';
import { useMobile } from '@/hooks/useMobile';
import { useTranslation } from '@/hooks/useTranslation';
import type { Pet } from '@/interfaces/pet';

export default function MascotasPage() {
  const { data: pets, loading, error, refetch, createPet, updatePet, deletePet } = usePets();
  const isMobile = useMobile();
  const { t } = useTranslation();
  const m = (cls: string) => isMobile ? `${cls} ${cls}__mobile` : cls;

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [deletingPet, setDeletingPet] = useState<Pet | null>(null);

  const handleAdd = async (data: Parameters<typeof createPet>[0]) => {
    await createPet(data);
    setShowAddModal(false);
  };

  const handleEdit = async (data: Parameters<typeof createPet>[0]) => {
    if (!editingPet?.id) return;
    await updatePet(editingPet.id, data);
    setEditingPet(null);
  };

  const handleDelete = async () => {
    if (!deletingPet?.id) return;
    await deletePet(deletingPet.id);
    setDeletingPet(null);
  };

  return (
    <Layout>
      <div className={m('pets-page')}>
        <div className="pets-header">
          <div>
            <h1>{t('pets.title')}</h1>
            <p className={m('subtitle')}>{t('pets.subtitle')}</p>
          </div>
          <button className="btn btn--primary" onClick={() => setShowAddModal(true)}>
            + {t('pets.addPet')}
          </button>
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
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={setEditingPet}
                onDelete={setDeletingPet}
              />
            ))}
          </div>
        )}
      </div>

      <AddPetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
      />
      <EditPetModal
        isOpen={!!editingPet}
        pet={editingPet}
        onClose={() => setEditingPet(null)}
        onSubmit={handleEdit}
      />
      <DeleteConfirmModal
        isOpen={!!deletingPet}
        pet={deletingPet}
        onClose={() => setDeletingPet(null)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
}
