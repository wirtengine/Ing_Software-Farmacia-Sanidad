export type UserRole = 'ADMIN' | 'REGENTE' | 'VENDEDOR';

export interface UserDto {
  id: string;
  username: string;
  nombreCompleto: string;
  rol: UserRole;
  activo: boolean | null | undefined; // <-- Permitir null o undefined para evitar el conflicto TS2322
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  nombreCompleto: string;
  password: string;
  rol: UserRole;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}