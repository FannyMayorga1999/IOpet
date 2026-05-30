'use client';

import { BreedCatalog } from '@/interfaces/breedCatalog';
import { api, endpoints } from '@/services/api';
import { useFetch } from './useFetch';
import type { ApiResponse } from '@/interfaces/api';

export function useBreedCatalog() {
  const { data, loading, error, refetch } = useFetch<BreedCatalog[]>(
    () => api.get<BreedCatalog[]>(endpoints.breedCatalog),
    []
  );

  const createBreed = async (formData: Partial<BreedCatalog>): Promise<ApiResponse<BreedCatalog>> => {
    const res = await api.post<BreedCatalog>(endpoints.breedCatalog, formData);
    await refetch();
    return res;
  };

  const updateBreed = async (id: string, formData: Partial<BreedCatalog>): Promise<ApiResponse<BreedCatalog>> => {
    const res = await api.patch<BreedCatalog>(endpoints.breedCatalogById(id), formData);
    await refetch();
    return res;
  };

  const deleteBreed = async (id: string): Promise<ApiResponse<null>> => {
    const res = await api.delete<null>(endpoints.breedCatalogById(id));
    await refetch();
    return res;
  };

  return { data, loading, error, refetch, createBreed, updateBreed, deleteBreed };
}

export function useBreedsBySpecies(species: string) {
  const { data, loading, error, refetch } = useFetch<BreedCatalog[]>(
    () => api.get<BreedCatalog[]>(endpoints.breedCatalogBySpecies(species)),
    [species]
  );
  return { data, loading, error, refetch };
}
