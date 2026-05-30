export type Species = 'dog' | 'cat' | 'bird' | 'fish' | 'other';
export type PetSize = 'small' | 'medium' | 'large' | 'giant';

export interface BreedCatalog {
  id?: string;
  name: string;
  species: Species;
  size?: PetSize;
  typicalWeightMin?: number;
  typicalWeightMax?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
