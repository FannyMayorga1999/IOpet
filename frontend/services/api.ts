import { ApiResponse } from '@/interfaces/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok) {
    throw new Error(json.error || json.message || 'Request failed');
  }

  return json;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};

export const endpoints = {
  pets: '/pets',
  petsByOwner: (ownerId: string) => `/pets/owner/${ownerId}`,
  petById: (id: string) => `/pets/${id}`,
  feedingSchedules: '/feeding-schedules',
  feedingSchedulesByPet: (petId: string) => `/feeding-schedules/pet/${petId}`,
  feedingSchedulesByType: (type: string) => `/feeding-schedules/type/${type}`,
  feedingScheduleById: (id: string) => `/feeding-schedules/${id}`,
  foodCatalog: '/food-catalog',
  foodCatalogBySpecies: (species: string) => `/food-catalog/species/${species}`,
  foodCatalogById: (id: string) => `/food-catalog/${id}`,
  breedCatalog: '/breed-catalog',
  breedCatalogBySpecies: (species: string) => `/breed-catalog/species/${species}`,
  breedCatalogById: (id: string) => `/breed-catalog/${id}`,
};
