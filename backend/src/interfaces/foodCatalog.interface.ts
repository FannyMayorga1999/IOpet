export type Species = 'dog' | 'cat' | 'bird' | 'fish' | 'other';
export type FoodCategory = 'kibble' | 'wet' | 'premium' | 'balanced' | 'treatment';

export interface FoodCatalog {
  id?: string;
  name: string;
  brand?: string;
  category: FoodCategory;
  suitableFor: Species[];
  description?: string;
  portionOptions: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodCatalogDTO {
  name: string;
  brand?: string;
  category: FoodCategory;
  suitableFor: Species[];
  description?: string;
  portionOptions: string[];
}

export interface UpdateFoodCatalogDTO {
  name?: string;
  brand?: string;
  category?: FoodCategory;
  suitableFor?: Species[];
  description?: string;
  portionOptions?: string[];
  active?: boolean;
}
