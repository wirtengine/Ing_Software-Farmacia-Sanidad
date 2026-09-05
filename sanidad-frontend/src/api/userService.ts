import { supabase } from '../config/supabaseClient';
import axiosClient from './axiosClient';
import type { RegisterRequest, UserDto, UserRole } from '../types/auth';

export const userService = {
    getAllUsers: async (): Promise<UserDto[]> => {
        const { data, error } = await supabase
            .rpc('obtener_usuarios_farmacia');

        if (error) {
            console.error('Error al consultar usuarios en Supabase:', error.message);
            throw new Error(`Error en Supabase: ${error.message}`);
        }

        if (!Array.isArray(data)) {
            return [];
        }

        // Mapeo seguro con Record<string, unknown> para cumplir con ESLint y TS
        return data.map((item: unknown) => {
            const u = item as Record<string, unknown>;
            return {
                id: String(u.id || ''),
                username: String(u.username || ''),
                nombreCompleto: String(u.nombreCompleto || ''),
                rol: (typeof u.rol === 'string' ? u.rol : 'VENDEDOR') as UserRole,
                activo: Boolean(u.activo),
            };
        }) as UserDto[];
    },

    createUser: async (data: RegisterRequest): Promise<void> => {
        await axiosClient.post('/auth/register', data);
    },

    deactivateUser: async (id: string): Promise<void> => {
        await axiosClient.patch(`/usuarios/${id}/desactivar`);
    },

    changeUserRole: async (id: string, nuevoRol: UserRole): Promise<void> => {
        await axiosClient.patch(`/usuarios/${id}/rol`, { nuevoRol });
    },

    changeUserPassword: async (id: string, passwordNueva: string): Promise<void> => {
        await axiosClient.patch(`/usuarios/${id}/password`, { passwordNueva });
    },
};