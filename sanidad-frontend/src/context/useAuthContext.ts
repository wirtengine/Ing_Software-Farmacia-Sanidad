import { useContext } from 'react';
import { AuthContext } from './AuthContextDefinition';

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error(
            'useAuthContext debe ser utilizado dentro de un AuthProvider'
        );
    }

    return context;
};