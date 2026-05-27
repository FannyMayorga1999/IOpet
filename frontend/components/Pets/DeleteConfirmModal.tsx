'use client';

import { useState } from 'react';
import { Pet } from '@/interfaces/pet';
import { useTranslation } from '@/hooks/useTranslation';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  pet: Pet | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmModal({ isOpen, pet, onClose, onConfirm }: DeleteConfirmModalProps) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !pet) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // error handled by caller
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('pets.deletePet')}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <p className="modal-body-text">{t('pets.confirmDelete', { name: pet.name })}</p>
        <div className="modal-actions">
          <button type="button" className="btn btn--secondary" onClick={onClose}>{t('common.cancel')}</button>
          <button type="button" className="btn btn--danger" onClick={handleConfirm} disabled={submitting}>
            {submitting ? t('common.loading') : t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
