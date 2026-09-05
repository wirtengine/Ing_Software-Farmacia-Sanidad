import { createContext } from 'react';
import type { UserDto, LoginRequest } from '../types/auth';

export interface AuthContextType {
    user: UserDto | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);