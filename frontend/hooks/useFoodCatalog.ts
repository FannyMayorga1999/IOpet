'use client';

import { FoodCatalog } from '@/interfaces/foodCatalog';
import { api, endpoints } from '@/services/api';
import { useFetch } from './useFetch';
import type { ApiResponse } from '@/interfaces/api';

export function useFoodCatalog() {
  const { data, loading, error, refetch } = useFetch<FoodCatalog[]>(
    () => api.get<FoodCatalog[]>(endpoints.foodCatalog),
    []
  );

  const createFood = async (formData: Partial<FoodCatalog>): Promise<ApiResponse<FoodCatalog>> => {
    const res = await api.post<FoodCatalog>(endpoints.foodCatalog, formData);
    await refetch();
    return res;
  };

  const updateFood = async (id: string, formData: Partial<FoodCatalog>): Promise<ApiResponse<FoodCatalog>> => {
    const res = await api.patch<FoodCatalog>(endpoints.foodCatalogById(id), formData);
    await refetch();
    return res;
  };

  const deleteFood = async (id: string): Promise<ApiResponse<null>> => {
    const res = await api.delete<null>(endpoints.foodCatalogById(id));
    await refetch();
    return res;
  };

  return { data, loading, error, refetch, createFood, updateFood, deleteFood };
}

export function useFoodBySpecies(species: string) {
  const { data, loading, error, refetch } = useFetch<FoodCatalog[]>(
    () => api.get<FoodCatalog[]>(endpoints.foodCatalogBySpecies(species)),
    [species]
  );
  return { data, loading, error, refetch };
}
