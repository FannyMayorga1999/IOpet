export interface User {
  id?: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  role: 'admin' | 'owner';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  displayName: string;
  photoUrl?: string;
  role?: User['role'];
}
