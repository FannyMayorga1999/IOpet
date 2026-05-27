'use client';

import { useState, useEffect } from 'react';
import { Pet } from '@/interfaces/pet';
import { useTranslation } from '@/hooks/useTranslation';

interface CreateDistributionModalProps {
  isOpen: boolean;
  pets: Pet[];
  onClose: () => void;
  onSubmit: (data: {
    petId: string;
    portionSize: string;
    foodType: string;
    scheduledTime: string;
    distributionType: 'manual' | 'programmed';
    notes?: string;
  }) => Promise<void>;
}

export function CreateDistributionModal({ isOpen, pets, onClose, onSubmit }: CreateDistributionModalProps) {
  const { t } = useTranslation();
  const [petId, setPetId] = useState('');
  const [distributionType, setDistributionType] = useState<'manual' | 'programmed'>('manual');
  const [portionSize, setPortionSize] = useState('');
  const [foodType, setFoodType] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && pets.length > 0 && !petId) {
      setPetId(pets[0].id || '');
    }
    if (isOpen && !scheduledDate) {
      const now = new Date();
      setScheduledDate(now.toISOString().split('T')[0]);
      setScheduledTime(now.toTimeString().split(':').slice(0, 2).join(':'));
    }
  }, [isOpen, pets, petId, scheduledDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId || !portionSize.trim() || !foodType.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        petId,
        portionSize: portionSize.trim(),
        foodType: foodType.trim(),
        scheduledTime: new Date(`${scheduledDate}T${scheduledTime}`).toISOString(),
        distributionType,
        notes: notes.trim() || undefined,
      });
      setPetId('');
      setDistributionType('manual');
      setPortionSize('');
      setFoodType('');
      setScheduledDate('');
      setScheduledTime('');
      setNotes('');
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
          <h2>{t('distribution.create')}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="form-field">
            <span>{t('distribution.form.pet')}</span>
            <select value={petId} onChange={(e) => setPetId(e.target.value)} required>
              <option value="" disabled>{t('distribution.form.selectPet')}</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species})
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>{t('distribution.form.type')}</span>
            <select value={distributionType} onChange={(e) => setDistributionType(e.target.value as 'manual' | 'programmed')}>
              <option value="manual">{t('distribution.form.manual')}</option>
              <option value="programmed">{t('distribution.form.programmed')}</option>
            </select>
          </label>
          <label className="form-field">
            <span>{t('distribution.form.portion')}</span>
            <input type="text" value={portionSize} onChange={(e) => setPortionSize(e.target.value)} placeholder="e.g. 200g" required />
          </label>
          <label className="form-field">
            <span>{t('distribution.form.foodType')}</span>
            <input type="text" value={foodType} onChange={(e) => setFoodType(e.target.value)} placeholder="e.g. Premium Dry Food" required />
          </label>
          <div className="form-row">
            <label className="form-field">
              <span>{t('distribution.form.date')}</span>
              <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required />
            </label>
            <label className="form-field">
              <span>{t('distribution.form.time')}</span>
              <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} required />
            </label>
          </div>
          <label className="form-field">
            <span>{t('distribution.form.notes')}</span>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>{t('common.cancel')}</button>
            <button type="submit" className="btn btn--primary" disabled={submitting || !petId || !portionSize.trim() || !foodType.trim()}>
              {submitting ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
