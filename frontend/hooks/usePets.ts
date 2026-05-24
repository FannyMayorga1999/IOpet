'use client';

import { Pet } from '@/interfaces/pet';
import { api, endpoints } from '@/services/api';
import { useFetch } from './useFetch';

export function usePets() {
  return useFetch<Pet[]>(() => api.get<Pet[]>(endpoints.pets), []);
}
