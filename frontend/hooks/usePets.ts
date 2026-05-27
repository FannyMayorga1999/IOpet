'use client';

import { Pet } from '@/interfaces/pet';
import { api, endpoints } from '@/services/api';
import { useFetch } from './useFetch';
import type { ApiResponse } from '@/interfaces/api';

interface PetFormData {
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
  breed?: string;
  birthDate?: string;
  weight?: number;
  ownerId?: string;
  photoUrl?: string;
}

export function usePets() {
  const { data, loading, error, refetch } = useFetch<Pet[]>(() => api.get<Pet[]>(endpoints.pets), []);

  const createPet = async (formData: PetFormData): Promise<ApiResponse<Pet>> => {
    const res = await api.post<Pet>(endpoints.pets, {
      ...formData,
      ownerId: formData.ownerId || 'user_001',
    });
    await refetch();
    return res;
  };

  const updatePet = async (id: string, formData: Partial<PetFormData>): Promise<ApiResponse<Pet>> => {
    const res = await api.patch<Pet>(endpoints.petById(id), formData);
    await refetch();
    return res;
  };

  const deletePet = async (id: string): Promise<ApiResponse<null>> => {
    const res = await api.delete<null>(endpoints.petById(id));
    await refetch();
    return res;
  };

  return { data, loading, error, refetch, createPet, updatePet, deletePet };
}
