'use client';

import { useState, useEffect } from 'react';
import { Pet } from '@/interfaces/pet';
import { useTranslation } from '@/hooks/useTranslation';

interface EditPetModalProps {
  isOpen: boolean;
  pet: Pet | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    species: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
    breed?: string;
    birthDate?: string;
    weight?: number;
  }) => Promise<void>;
}

const SPECIES = ['dog', 'cat', 'bird', 'fish', 'other'] as const;

export function EditPetModal({ isOpen, pet, onClose, onSubmit }: EditPetModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'bird' | 'fish' | 'other'>('dog');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pet) {
      setName(pet.name);
      setSpecies(pet.species);
      setBreed(pet.breed || '');
      setBirthDate(pet.birthDate || '');
      setWeight(pet.weight ? String(pet.weight) : '');
    }
  }, [pet]);

  if (!isOpen || !pet) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        species,
        breed: breed.trim() || undefined,
        birthDate: birthDate || undefined,
        weight: weight ? parseFloat(weight) : undefined,
      });
      onClose();
    } catch {
      // error handled by caller
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('pets.editPet')}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="form-field">
            <span>{t('pets.form.name')}</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="form-field">
            <span>{t('pets.form.species')}</span>
            <select value={species} onChange={(e) => setSpecies(e.target.value as typeof species)}>
              {SPECIES.map((s) => (
                <option key={s} value={s}>{t(`pets.form.species_${s}`)}</option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>{t('pets.form.breed')}</span>
            <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} />
          </label>
          <label className="form-field">
            <span>{t('pets.form.birthDate')}</span>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </label>
          <label className="form-field">
            <span>{t('pets.form.weight')}</span>
            <input type="number" step="0.1" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>{t('common.cancel')}</button>
            <button type="submit" className="btn btn--primary" disabled={submitting || !name.trim()}>
              {submitting ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
