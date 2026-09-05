import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <ShieldAlert className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Acceso No Autorizado</h1>
                <p className="text-slate-600 text-sm mb-6">
                    No tienes los permisos suficientes para acceder a esta sección.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-flex px-5 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition"
                >
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
};