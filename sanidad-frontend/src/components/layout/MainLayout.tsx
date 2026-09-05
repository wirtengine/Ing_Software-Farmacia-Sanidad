import React, { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Pill,
    LayoutDashboard,
    Users,
    Package,
    ShoppingBag,
    Receipt,
    BarChart3,
    Menu,
    X,
    LogOut,
    ShieldCheck,
    Sparkles,
    ChevronRight,
    Clock,
    HeartPulse,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();

    // Estado para controlar el menú en móviles y escritorio
    const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
    const [sidebarCollapsedDesktop, setSidebarCollapsedDesktop] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const currentDate = new Date().toLocaleDateString('es-ES', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const menuItems = [
        {
            label: 'Panel Principal',
            icon: LayoutDashboard,
            path: '/dashboard',
            roles: ['ADMIN', 'REGENTE', 'VENDEDOR'],
        },
        {
            label: 'Usuarios y Roles',
            icon: Users,
            path: '/usuarios',
            roles: ['ADMIN'],
        },
        {
            label: 'Catálogo de Medicamentos',
            icon: Package,
            path: '/medicamentos',
            roles: ['ADMIN', 'REGENTE'],
            disabled: true,
        },
        {
            label: 'Punto de Venta',
            icon: ShoppingBag,
            path: '/ventas',
            roles: ['ADMIN', 'VENDEDOR'],
            disabled: true,
        },
        {
            label: 'Recetas Médicas',
            icon: Receipt,
            path: '/recetas',
            roles: ['ADMIN', 'REGENTE'],
            disabled: true,
        },
        {
            label: 'Módulo de Finanzas',
            icon: BarChart3,
            path: '/finanzas',
            roles: ['ADMIN'],
            disabled: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-teal-50/20 to-cyan-50/40 flex text-slate-800 font-sans">

            {/* Fondo oscuro traslúcido para celular */}
            {sidebarOpenMobile && (
                <div
                    onClick={() => setSidebarOpenMobile(false)}
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
                />
            )}

            {/* SIDEBAR LATERAL CORREGIDO Y CENTRADO */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 bg-white/90 backdrop-blur-xl border-r border-emerald-100 flex flex-col justify-between transition-all duration-300 ease-in-out shadow-xl lg:shadow-none ${
                    sidebarOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } ${
                    sidebarCollapsedDesktop ? 'lg:w-20' : 'lg:w-72'
                } w-72`}
            >
                <div className="p-4 flex flex-col items-center w-full">
                    {/* HEADER DEL SIDEBAR (LOGO CENTRADO SI ESTÁ COLAPSADO) */}
                    <div className={`flex items-center w-full mb-8 ${sidebarCollapsedDesktop ? 'justify-center' : 'justify-between px-2'}`}>
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl text-white shadow-md shadow-emerald-600/20 shrink-0">
                                <Pill className="h-6 w-6" />
                            </div>
                            {!sidebarCollapsedDesktop && (
                                <div className="transition-opacity duration-200">
                                    <h1 className="font-black text-slate-800 text-base tracking-tight whitespace-nowrap">Farmacia Sanidad</h1>
                                    <p className="text-[10px] font-bold text-emerald-600">Sistema Operacional</p>
                                </div>
                            )}
                        </div>

                        {/* Cierre móvil */}
                        <button
                            onClick={() => setSidebarOpenMobile(false)}
                            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* MENÚ DE OPCIONES (CENTRADO AUTOMÁTICO EN MODO COLAPSADO) */}
                    <nav className="w-full space-y-2">
                        {!sidebarCollapsedDesktop && (
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                                Navegación
                            </p>
                        )}

                        {menuItems
                            .filter((item) => user && item.roles.includes(user.rol))
                            .map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                if (item.disabled) {
                                    return (
                                        <div
                                            key={item.label}
                                            title={sidebarCollapsedDesktop ? item.label : undefined}
                                            className={`flex items-center gap-3 py-3 rounded-2xl text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed ${
                                                sidebarCollapsedDesktop ? 'justify-center px-0' : 'justify-between px-3.5'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="h-5 w-5 text-slate-400 shrink-0" />
                                                {!sidebarCollapsedDesktop && <span>{item.label}</span>}
                                            </div>
                                            {!sidebarCollapsedDesktop && (
                                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">Pronto</span>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        title={sidebarCollapsedDesktop ? item.label : undefined}
                                        onClick={() => setSidebarOpenMobile(false)}
                                        className={`flex items-center gap-3 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                                            sidebarCollapsedDesktop ? 'justify-center px-0 w-12 mx-auto' : 'justify-between px-3.5'
                                        } ${
                                            isActive
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                                                : 'text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                            {!sidebarCollapsedDesktop && <span>{item.label}</span>}
                                        </div>
                                        {isActive && !sidebarCollapsedDesktop && <ChevronRight className="h-4 w-4 text-white/80" />}
                                    </Link>
                                );
                            })}
                    </nav>
                </div>

                {/* FOOTER DEL USUARIO (CENTRADO SI ESTÁ COLAPSADO) */}
                <div className={`m-3 p-3 bg-emerald-50/80 border border-emerald-100 rounded-2xl space-y-3 ${sidebarCollapsedDesktop ? 'flex flex-col items-center' : ''}`}>
                    <div className={`flex items-center gap-3 ${sidebarCollapsedDesktop ? 'justify-center' : ''}`}>
                        <div className="p-2 bg-emerald-600/10 text-emerald-700 rounded-xl border border-emerald-200 shrink-0">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        {!sidebarCollapsedDesktop && (
                            <div className="overflow-hidden">
                                <p className="text-xs font-extrabold text-slate-800 truncate">{user?.nombreCompleto}</p>
                                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{user?.rol}</p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        title={sidebarCollapsedDesktop ? "Cerrar Sesión" : undefined}
                        className={`w-full py-2 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition shadow-xs flex items-center justify-center gap-2 cursor-pointer`}
                    >
                        <LogOut className="h-4 w-4 shrink-0" />
                        {!sidebarCollapsedDesktop && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL Y BARRA SUPERIOR */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* ENCABEZADO SUPERIOR */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-emerald-100 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        {/* Botón Móvil */}
                        <button
                            onClick={() => setSidebarOpenMobile(true)}
                            className="lg:hidden p-2 text-slate-600 hover:text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition cursor-pointer"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Botón Desktop (Ocultar/Mostrar con ícono claro) */}
                        <button
                            onClick={() => setSidebarCollapsedDesktop(!sidebarCollapsedDesktop)}
                            className="hidden lg:flex items-center gap-2 p-2.5 text-slate-600 hover:text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/80 rounded-2xl transition cursor-pointer text-xs font-bold"
                        >
                            {sidebarCollapsedDesktop ? (
                                <>
                                    <PanelLeftOpen className="h-4 w-4 text-emerald-600" />
                                    <span>Mostrar Menú</span>
                                </>
                            ) : (
                                <>
                                    <PanelLeftClose className="h-4 w-4 text-emerald-600" />
                                    <span>Ocultar Menú</span>
                                </>
                            )}
                        </button>

                        <span className="text-xs font-bold text-slate-500 hidden sm:inline-flex items-center gap-1.5 ml-2">
              <HeartPulse className="h-4 w-4 text-emerald-600 animate-pulse" />
              Gestión Integral — Farmacia Sanidad
            </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-100">
                            <Clock className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="capitalize">{currentDate}</span>
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Conexión Segura</span>
            </span>
                    </div>
                </header>

                {/* ÁREA DE CONTENIDO PRINCIPAL */}
                <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>

        </div>
    );
};