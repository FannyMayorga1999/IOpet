'use client';

import { useState } from 'react';
import { Layout } from '@/components/Layout/Layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useFoodCatalog } from '@/hooks/useFoodCatalog';
import { useMobile } from '@/hooks/useMobile';
import { useTranslation } from '@/hooks/useTranslation';
import type { FoodCatalog, Species, FoodCategory } from '@/interfaces/foodCatalog';

const SPECIES: Species[] = ['dog', 'cat', 'bird', 'fish', 'other'];
const CATEGORIES: FoodCategory[] = ['kibble', 'wet', 'premium', 'balanced', 'treatment'];

interface FoodFormData {
  name: string;
  brand: string;
  category: FoodCategory;
  suitableFor: Species[];
  portionOptions: string;
  description: string;
}

const emptyForm: FoodFormData = {
  name: '',
  brand: '',
  category: 'kibble',
  suitableFor: [],
  portionOptions: '',
  description: '',
};

export default function FoodCatalogPage() {
  const { data: items, loading, error, refetch, createFood, updateFood, deleteFood } = useFoodCatalog();
  const isMobile = useMobile();
  const { t } = useTranslation();
  const m = (cls: string) => isMobile ? `${cls} ${cls}__mobile` : cls;
  const [editing, setEditing] = useState<FoodCatalog | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FoodFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item: FoodCatalog) => {
    setForm({
      name: item.name,
      brand: item.brand || '',
      category: item.category,
      suitableFor: item.suitableFor,
      portionOptions: item.portionOptions.join(', '),
      description: item.description || '',
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        brand: form.brand || undefined,
        description: form.description || undefined,
        portionOptions: form.portionOptions.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (editing?.id) {
        await updateFood(editing.id, payload);
      } else {
        await createFood(payload);
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
      await deleteFood(id);
    } catch {
      // handled by caller
    } finally {
      setDeletingId(null);
    }
  };

  const toggleSuitableFor = (s: Species) => {
    setForm((prev) => ({
      ...prev,
      suitableFor: prev.suitableFor.includes(s)
        ? prev.suitableFor.filter((x) => x !== s)
        : [...prev.suitableFor, s],
    }));
  };

  return (
    <Layout>
      <div className={m('history-page')}>
        <div className="history-header">
          <div>
            <h1>{t('sidebar.foodCatalog')}</h1>
            <p className="subtitle">Gestiona los tipos de comida disponibles en el sistema</p>
          </div>
          <button className="btn btn--primary" onClick={openCreate}>
            + Nuevo alimento
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
          <EmptyState icon="🍲" message="No hay alimentos registrados aún" />
        ) : (
          <div className={m('history-table-wrapper')}>
            <table className={m('history-table')}>
              <thead>
                <tr className={m('history-header-row')}>
                  <th className={m('history-th')} data-label="Nombre">Nombre</th>
                  <th className={m('history-th')} data-label="Marca">Marca</th>
                  <th className={m('history-th')} data-label="Categoría">Categoría</th>
                  <th className={m('history-th')} data-label="Especies">Especies</th>
                  <th className={m('history-th')} data-label="Porciones">Porciones</th>
                  <th className={m('history-th')} data-label="Activo">Activo</th>
                  <th className={m('history-th')} data-label="Acciones">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className={m('history-td')} data-label="📛">{item.name}</td>
                    <td className={m('history-td')} data-label="🏷️">{item.brand || '—'}</td>
                    <td className={m('history-td')} data-label="📂">{item.category}</td>
                    <td className={m('history-td')} data-label="🐾">{item.suitableFor.join(', ')}</td>
                    <td className={m('history-td')} data-label="⚖️">{item.portionOptions.join(', ')}</td>
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
              <h2>{editing ? 'Editar alimento' : 'Nuevo alimento'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <label className="form-field">
                <span>Nombre *</span>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label className="form-field">
                <span>Marca</span>
                <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </label>
              <label className="form-field">
                <span>Categoría *</span>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as FoodCategory })}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span>Especies aptas *</span>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
                  {SPECIES.map((s) => (
                    <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.suitableFor.includes(s)}
                        onChange={() => toggleSuitableFor(s)}
                      />
                      {t(`pets.form.species_${s}`)}
                    </label>
                  ))}
                </div>
              </label>
              <label className="form-field">
                <span>Porciones (separadas por coma) *</span>
                <input
                  type="text"
                  value={form.portionOptions}
                  onChange={(e) => setForm({ ...form, portionOptions: e.target.value })}
                  placeholder="50g, 100g, 150g"
                  required
                />
              </label>
              <label className="form-field">
                <span>Descripción</span>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn--secondary" onClick={() => setShowForm(false)}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn--primary" disabled={submitting || !form.name.trim() || form.suitableFor.length === 0}>
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
