import React from 'react';
import { useAuth } from '../context/useAuth';
import { MainLayout } from '../components/layout/MainLayout';
import {
    UserPlus,
    ClipboardList,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    DollarSign,
    AlertTriangle,
    Package,
    BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto space-y-8">

                {/* BANNER PRINCIPAL */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 sm:p-8 shadow-xl shadow-emerald-950/10 text-white">
                    <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Estado Operativo Excelente
            </span>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            ¡Bienvenido, {user?.nombreCompleto}!
                        </h2>
                        <p className="text-emerald-50 text-xs sm:text-sm font-medium max-w-xl">
                            Panel central de control. Selecciona las opciones del menú lateral o los accesos rápidos para operar bajo tu perfil <strong className="uppercase underline decoration-white/60">{user?.rol}</strong>.
                        </p>
                    </div>
                </div>

                {/* TARJETAS DE MÉTRICAS */}
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                        Resumen de Operaciones
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white/80 backdrop-blur-md border border-emerald-100 rounded-3xl p-5 shadow-xs hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ventas Hoy</span>
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-slate-800">$0.00</p>
                            <p className="text-[11px] font-semibold text-slate-400 mt-1">Módulo contable listo</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-md border border-emerald-100 rounded-3xl p-5 shadow-xs hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Transacciones</span>
                                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-slate-800">0</p>
                            <p className="text-[11px] font-semibold text-teal-600 mt-1">Sin tickets emitidos</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-md border border-emerald-100 rounded-3xl p-5 shadow-xs hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Alertas de Stock</span>
                                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-slate-800">0</p>
                            <p className="text-[11px] font-semibold text-amber-600 mt-1">Lotes comprobados</p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-md border border-emerald-100 rounded-3xl p-5 shadow-xs hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tu Perfil RBAC</span>
                                <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-2xl border border-cyan-100">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                            </div>
                            <p className="text-lg font-black text-slate-800 uppercase">{user?.rol}</p>
                            <p className="text-[11px] font-semibold text-cyan-600 mt-1">Acceso seguro activo</p>
                        </div>
                    </div>
                </div>

                {/* ACCESOS DIRECTOS */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        Módulos del Sistema
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {user?.rol === 'ADMIN' && (
                            <Link
                                to="/usuarios"
                                className="group p-6 bg-white hover:bg-emerald-50/50 border border-emerald-200/80 hover:border-emerald-400 rounded-3xl transition-all duration-300 shadow-xs hover:shadow-md flex items-start gap-4 transform hover:-translate-y-1"
                            >
                                <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-600/20 group-hover:scale-110 transition">
                                    <UserPlus className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Módulo ADMIN</span>
                                    <h4 className="font-extrabold text-slate-800 text-base group-hover:text-emerald-700 transition">Usuarios y Roles</h4>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        Creación de empleados, desactivación lógica y administración de permisos.
                                    </p>
                                </div>
                            </Link>
                        )}

                        <div className="p-6 bg-white/60 border border-slate-200/80 rounded-3xl opacity-75 flex items-start gap-4">
                            <div className="p-4 bg-teal-100 text-teal-700 rounded-2xl">
                                <Package className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Próximamente</span>
                                <h4 className="font-extrabold text-slate-800 text-base">Catálogo & Lotes FEFO</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Registro de medicamentos, fechas de caducidad y alertas.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-white/60 border border-slate-200/80 rounded-3xl opacity-75 flex items-start gap-4">
                            <div className="p-4 bg-amber-100 text-amber-700 rounded-2xl">
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Próximamente</span>
                                <h4 className="font-extrabold text-slate-800 text-base">Recetas Médicas</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Dispensación de fármacos bajo prescripción con firma del Regente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TARJETA DE REFLEXIÓN PASTORAL */}
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-600 text-white rounded-2xl">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-700">«He aquí que yo les traeré sanidad y medicina...»</p>
                            <p className="text-[11px] font-semibold text-emerald-700">Jeremías 33:6 — Compromiso con la salud y el servicio</p>
                        </div>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};