export interface Pet {
  id?: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
  breed?: string;
  birthDate?: string;
  weight?: number;
  ownerId: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}
