import axiosClient from "./axiosClient";
import type { LoginRequest, RegisterRequest, UserDto } from "../types/auth";

// Interfaz para la respuesta del Login enviada por Spring Boot
export interface AuthResponse {
  token: string;
  user?: UserDto;
  username?: string;
  rol?: string;
}

export const authService = {
  /**
   * Inicia sesión en el sistema y guarda el token JWT en localStorage
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>("/auth/login", credentials);

    // Si la respuesta contiene el token, se guarda en localStorage bajo 'jwt_token'
    if (response.data && response.data.token) {
      localStorage.setItem("jwt_token", response.data.token);
    }

    return response.data;
  },

  /**
   * Registra un nuevo empleado en la base de datos
   */
  register: async (data: RegisterRequest): Promise<UserDto> => {
    const response = await axiosClient.post<UserDto>("/auth/register", data);
    return response.data;
  },

  /**
   * Obtiene la información del usuario autenticado actualmente
   */
  getCurrentUser: async (): Promise<UserDto> => {
    const response = await axiosClient.get<UserDto>("/auth/me");
    return response.data;
  },

  /**
   * Cierra sesión eliminando el token de almacenamiento local
   */
  logout: (): void => {
    localStorage.removeItem("jwt_token");
  },
};