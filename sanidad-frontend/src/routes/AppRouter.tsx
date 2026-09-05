import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicOnlyRoute, ProtectedRoute } from './ProtectedRoutes';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { UsersPage } from '../pages/UsersPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas Públicas (Solo para usuarios NO autenticados) */}
                <Route element={<PublicOnlyRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>

                {/* Rutas Protegidas (General) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

                {/* Rutas Protegidas (Exclusivas de ADMIN) */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/usuarios" element={<UsersPage />} />
                </Route>

                {/* Pantalla de Error por Permisos */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};