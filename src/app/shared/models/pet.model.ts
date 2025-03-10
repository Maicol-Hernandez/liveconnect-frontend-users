export interface Pet {
  id: number;
  name: string;
  created_at: string;
}

export interface PetResponse {
  data: Pet[];
  success: string;
}
