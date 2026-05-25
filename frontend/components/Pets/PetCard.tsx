'use client';

import { Pet } from '@/interfaces/pet';
import { useTranslation } from '@/hooks/useTranslation';

const speciesEmoji: Record<Pet['species'], string> = {
  dog: '🐶',
  cat: '🐱',
  bird: '🐦',
  fish: '🐟',
  other: '🐾',
};

function formatDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function calcAge(birthDate?: string): string {
  if (!birthDate) return '—';
  const diff = Date.now() - new Date(birthDate).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  if (years > 0) return `${years}y ${months}m`;
  return `${months}m`;
}

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  const { t } = useTranslation();

  return (
    <div className="pet-card">
      <div className="pet-card-header">
        <span className="pet-card-emoji">{speciesEmoji[pet.species] || speciesEmoji.other}</span>
        <span className="pet-card-species">{pet.species}</span>
      </div>
      <div className="pet-card-body">
        <h3 className="pet-card-name">{pet.name}</h3>
        {pet.breed && <p className="pet-card-breed">{pet.breed}</p>}
        <div className="pet-card-meta">
          {pet.weight && (
            <span className="pet-card-meta-item">
              <strong>{t('petCard.weight')}</strong> {pet.weight} kg
            </span>
          )}
          <span className="pet-card-meta-item">
            <strong>{t('petCard.age')}</strong> {calcAge(pet.birthDate)}
          </span>
          <span className="pet-card-meta-item">
            <strong>{t('petCard.birth')}</strong> {pet.birthDate ? formatDate(pet.birthDate) : t('common.unknown')}
          </span>
        </div>
      </div>
    </div>
  );
}
