'use client';

import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useBreedCatalog } from '@/hooks/useBreedCatalog';
import { useMobile } from '@/hooks/useMobile';
import { useTranslation } from '@/hooks/useTranslation';
import type { BreedCatalog, Species, PetSize } from '@/interfaces/breedCatalog';

const SPECIES: Species[] = ['dog', 'cat', 'bird', 'fish', 'other'];
const SIZES: PetSize[] = ['small', 'medium', 'large', 'giant'];

interface BreedFormData {
  name: string;
  species: Species;
  size: string;
  typicalWeightMin: string;
  typicalWeightMax: string;
}

const emptyForm: BreedFormData = {
  name: '',
  species: 'dog',
  size: '',
  typicalWeightMin: '',
  typicalWeightMax: '',
};

export default function BreedCatalogPage() {
  const { data: items, loading, error, refetch, createBreed, updateBreed, deleteBreed } = useBreedCatalog();
  const isMobile = useMobile();
  const { t } = useTranslation();
  const m = (cls: string) => isMobile ? `${cls} ${cls}__mobile` : cls;
  const [editing, setEditing] = useState<BreedCatalog | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BreedFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item: BreedCatalog) => {
    setForm({
      name: item.name,
      species: item.species,
      size: item.size || '',
      typicalWeightMin: item.typicalWeightMin ? String(item.typicalWeightMin) : '',
      typicalWeightMax: item.typicalWeightMax ? String(item.typicalWeightMax) : '',
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        species: form.species,
      };
      if (form.size) payload.size = form.size;
      if (form.typicalWeightMin) payload.typicalWeightMin = parseFloat(form.typicalWeightMin);
      if (form.typicalWeightMax) payload.typicalWeightMax = parseFloat(form.typicalWeightMax);
      if (editing?.id) {
        await updateBreed(editing.id, payload);
      } else {
        await createBreed(payload);
      }
      setShowForm(false);
    } catch {
      // handled by caller
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteBreed(id);
    } catch {
      // handled by caller
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout>
      <div className={m('history-page')}>
        <div className="history-header">
          <div>
            <h1>{t('sidebar.breedCatalog')}</h1>
            <p className="subtitle">Gestiona las razas disponibles por especie</p>
          </div>
          <button className="btn btn--primary" onClick={openCreate}>
            + Nueva raza
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="empty-state">
            <span className="empty-icon">⚠️</span>
            <p className="empty-text">{error}</p>
            <button onClick={refetch} className="btn btn--secondary" style={{ marginTop: 8 }}>
              {t('common.retry')}
            </button>
          </div>
        ) : !items || items.length === 0 ? (
          <EmptyState icon="🐾" message="No hay razas registradas aún" />
        ) : (
          <div className={m('history-table-wrapper')}>
            <table className={m('history-table')}>
              <thead>
                <tr className={m('history-header-row')}>
                  <th className={m('history-th')} data-label="Nombre">Nombre</th>
                  <th className={m('history-th')} data-label="Especie">Especie</th>
                  <th className={m('history-th')} data-label="Tamaño">Tamaño</th>
                  <th className={m('history-th')} data-label="Peso min">Peso min</th>
                  <th className={m('history-th')} data-label="Peso max">Peso max</th>
                  <th className={m('history-th')} data-label="Activo">Activo</th>
                  <th className={m('history-th')} data-label="Acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className={m('history-td')} data-label="📛">{item.name}</td>
                    <td className={m('history-td')} data-label="🐾">{t(`pets.form.species_${item.species}`)}</td>
                    <td className={m('history-td')} data-label="📏">{item.size || '—'}</td>
                    <td className={m('history-td')} data-label="⬇️">{item.typicalWeightMin ? `${item.typicalWeightMin} kg` : '—'}</td>
                    <td className={m('history-td')} data-label="⬆️">{item.typicalWeightMax ? `${item.typicalWeightMax} kg` : '—'}</td>
                    <td className={m('history-td')} data-label="✅">{item.active ? '✅' : '❌'}</td>
                    <td className={m('history-td')} data-label="⚙️">
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn--sm" onClick={() => openEdit(item)}>
                          {t('common.edit')}
                        </button>
                        <button
                          className="btn btn--sm btn--danger"
                          onClick={() => handleDelete(item.id!)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id ? '...' : t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar raza' : 'Nueva raza'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <label className="form-field">
                <span>Nombre *</span>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label className="form-field">
                <span>Especie *</span>
                <select value={form.species} onChange={(e) => setForm({ ...form, species: e.target.value as Species })}>
                  {SPECIES.map((s) => (
                    <option key={s} value={s}>{t(`pets.form.species_${s}`)}</option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span>Tamaño</span>
                <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
                  <option value="">—</option>
                  {SIZES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span>Peso mínimo (kg)</span>
                <input type="number" step="0.1" min="0" value={form.typicalWeightMin} onChange={(e) => setForm({ ...form, typicalWeightMin: e.target.value })} />
              </label>
              <label className="form-field">
                <span>Peso máximo (kg)</span>
                <input type="number" step="0.1" min="0" value={form.typicalWeightMax} onChange={(e) => setForm({ ...form, typicalWeightMax: e.target.value })} />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setShowForm(false)}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn--primary" disabled={submitting || !form.name.trim()}>
                  {submitting ? t('common.loading') : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
