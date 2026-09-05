import React, { useEffect, useState } from 'react';
import type { UserDto, LoginRequest } from '../types/auth';
import { authService } from '../api/authService';
import axiosClient from '../api/axiosClient';
import { AuthContext } from './AuthContextDefinition';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserDto | null>(null);

    const [token, setToken] = useState<string | null>(
        localStorage.getItem('jwt_token')
    );

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('jwt_token');

            if (!storedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const userData = await authService.getCurrentUser();

                setUser(userData);
                setToken(storedToken);
            } catch (error) {
                console.error(
                    'No se pudo restaurar la sesión del usuario:',
                    error
                );

                localStorage.removeItem('jwt_token');
                setToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        void initAuth();
    }, []);

    const login = async (credentials: LoginRequest): Promise<void> => {
        try {
            const response = await authService.login(credentials);

            let jwtToken: string | null = null;

            if (typeof response === 'string') {
                jwtToken = response;
            } else if (
                response &&
                typeof response === 'object' &&
                'token' in response &&
                typeof response.token === 'string'
            ) {
                jwtToken = response.token;
            }

            if (!jwtToken || jwtToken.trim() === '') {
                throw new Error(
                    'La respuesta del servidor no contiene un token JWT válido.'
                );
            }

            localStorage.setItem('jwt_token', jwtToken);
            setToken(jwtToken);

            const responseUser = await axiosClient.get<UserDto>('/auth/me', {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            setUser(responseUser.data);
        } catch (error) {
            console.error('Error durante el login:', error);

            localStorage.removeItem('jwt_token');
            setToken(null);
            setUser(null);

            throw error;
        }
    };

    const logout = (): void => {
        localStorage.removeItem('jwt_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: user !== null,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};