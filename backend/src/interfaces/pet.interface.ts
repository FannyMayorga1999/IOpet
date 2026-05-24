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

export interface CreatePetDTO {
  name: string;
  species: Pet['species'];
  breed?: string;
  birthDate?: string;
  weight?: number;
  ownerId: string;
  photoUrl?: string;
}

export interface UpdatePetDTO {
  name?: string;
  species?: Pet['species'];
  breed?: string;
  birthDate?: string;
  weight?: number;
  photoUrl?: string;
}
