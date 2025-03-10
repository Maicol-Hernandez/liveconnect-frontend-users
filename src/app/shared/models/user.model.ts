import { Pet } from './pet.model';

export interface User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  password_confirm?: string;
  pets?: Pet[];
  token?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: User;
  status: string;
}

export interface UserResponse {
  data: User[]
  success: string
}

export interface UserUpdateResponse {
  data: User
  success: string
}
