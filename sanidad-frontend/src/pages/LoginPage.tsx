import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import {
    Lock,
    User,
    Pill,
    AlertCircle,
    Loader2,
    Eye,
    EyeOff,
    ShieldCheck,
    HeartPulse,
    Sparkles,
    BookOpen,
    Cross,
    CheckCircle2,
    Stethoscope,
    Activity
} from 'lucide-react';

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login({ username, password });
            navigate('/dashboard');
        } catch {
            setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-100/70 via-teal-50/50 to-cyan-100/60 p-4 sm:p-6 lg:p-0 text-slate-700 overflow-hidden font-sans relative">

            {/* ESTILOS CSS DE ANIMACIONES PERSONALIZADAS (KEYFRAMES) */}
            <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(6deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-6deg); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .animate-float-1 { animation: floatSlow 6s ease-in-out infinite; }
        .animate-float-2 { animation: floatReverse 7s ease-in-out infinite; }
        .animate-glow { animation: glowPulse 5s ease-in-out infinite; }
      `}</style>

            {/* CONTENEDOR SPLIT RESPONSIVE (100% ANCHO Y ALTO EN PANTALLAS GRANDES) */}
            <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12 relative z-10 overflow-hidden">

                {/* ================= PANEL IZQUIERDO: INSTITUCIONAL & BÍBLICO (7 COLS EN LG) ================= */}
                <div className="hidden lg:flex lg:col-span-7 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 p-12 lg:p-16 flex-col justify-between relative overflow-hidden shadow-2xl">

                    {/* Partículas Flotantes con CSS Animaciones */}
                    <div className="absolute top-16 left-16 text-emerald-200/30 animate-float-1 pointer-events-none">
                        <Cross className="h-14 w-14" />
                    </div>
                    <div className="absolute bottom-28 left-1/3 text-teal-200/25 animate-float-2 pointer-events-none">
                        <Pill className="h-28 w-28 -rotate-45" />
                    </div>
                    <div className="absolute top-1/3 right-16 text-amber-200/30 animate-float-1 pointer-events-none" style={{ animationDelay: '1s' }}>
                        <HeartPulse className="h-16 w-16" />
                    </div>

                    {/* Luces de Fondo (Glows) */}
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none animate-glow" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl pointer-events-none animate-glow" style={{ animationDelay: '2.5s' }} />

                    {/* Header Institucional */}
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl text-white transform hover:rotate-6 transition duration-300">
                                <Pill className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-wide text-white drop-shadow-sm">
                                    Farmacia Sanidad
                                </h1>
                                <p className="text-xs text-emerald-100 font-semibold tracking-wide">
                                    Servicio, Salud y Esperanza
                                </p>
                            </div>
                        </div>

                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-emerald-100 border border-white/20 shadow-xs">
              <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} /> UNI — Ingeniería de Software I
            </span>
                    </div>

                    {/* Tarjeta Bíblica de Sanidad (Jeremías 33:6) */}
                    <div className="relative z-10 my-auto space-y-8 max-w-2xl">
                        <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-xl p-8 rounded-3xl border border-amber-200/40 shadow-2xl space-y-4 transform hover:-translate-y-1 transition duration-300">
                            <div className="flex items-center justify-between border-b border-white/15 pb-3">
                                <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Mensaje de Reflexión y Fe</span>
                                </div>
                                <Activity className="h-4 w-4 text-emerald-200 animate-pulse" />
                            </div>

                            <blockquote className="text-white italic text-lg sm:text-xl leading-relaxed font-serif tracking-wide drop-shadow-xs">
                                «He aquí que yo les traeré sanidad y medicina; y los curaré, y les revelaré abundancia de paz y de verdad.»
                            </blockquote>

                            <p className="text-right text-xs font-black text-amber-200 tracking-widest uppercase">
                                — Jeremías 33:6
                            </p>
                        </div>

                        {/* Fichas Informativas de Salud */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xs hover:bg-white/20 transition flex flex-col gap-2">
                                <div className="p-2 bg-emerald-400/20 text-emerald-200 rounded-xl w-fit">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Inventario FEFO</p>
                                    <p className="text-[11px] text-emerald-100/80">Control de vencimientos</p>
                                </div>
                            </div>

                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xs hover:bg-white/20 transition flex flex-col gap-2">
                                <div className="p-2 bg-teal-400/20 text-teal-200 rounded-xl w-fit">
                                    <Stethoscope className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Recetas Médicas</p>
                                    <p className="text-[11px] text-emerald-100/80">Dispensación Regente</p>
                                </div>
                            </div>

                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xs hover:bg-white/20 transition flex flex-col gap-2">
                                <div className="p-2 bg-amber-400/20 text-amber-200 rounded-xl w-fit">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Roles RBAC</p>
                                    <p className="text-[11px] text-emerald-100/80">Acceso seguro Ley 292</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer del Lado Izquierdo */}
                    <div className="relative z-10 flex items-center justify-between text-xs text-emerald-100/80 font-medium border-t border-white/15 pt-6">
                        <span>Sistemas de Control Operacional — Farmacia Sanidad</span>
                        <span>© 2026 Managua, Nicaragua</span>
                    </div>
                </div>

                {/* ================= PANEL DERECHO: FORMULARIO GLASSMORPHI CÁLIDO (5 COLS EN LG) ================= */}
                <div className="col-span-1 lg:col-span-5 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-emerald-100/60 p-6 sm:p-12 lg:p-16 flex flex-col justify-center items-center relative overflow-y-auto">

                    {/* Adornos animados para el panel derecho */}
                    <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none animate-glow" />
                    <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl pointer-events-none animate-glow" style={{ animationDelay: '3s' }} />

                    {/* Tarjeta Flotante con Borde Brillante y Sombra Profunda */}
                    <div className="w-full max-w-md bg-white/85 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl shadow-emerald-950/10 border border-white/80 space-y-6 relative z-10 transform transition hover:shadow-emerald-900/15">

                        {/* Logo de móvil */}
                        <div className="flex lg:hidden items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
                                    <Pill className="h-6 w-6" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-black text-slate-800">Farmacia Sanidad</h1>
                                    <p className="text-xs text-emerald-600 font-semibold">Servicio y Salud</p>
                                </div>
                            </div>
                        </div>

                        <div>
              <span className="px-3.5 py-1 bg-emerald-100/80 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 shadow-xs inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Portal Administrativo
              </span>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight mt-3">
                                ¡Bienvenido!
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                                Ingresa tus credenciales autorizadas
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="flex items-center gap-3 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold animate-bounce">
                                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Input Usuario */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Usuario
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition" />
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Ej. mlopez"
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition font-medium shadow-xs"
                                    />
                                </div>
                            </div>

                            {/* Input Contraseña */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Contraseña
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-11 py-3 bg-slate-50/80 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition font-medium shadow-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Botón de Submit con Gradiente Fluido */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 transition duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Verificando...</span>
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>

                            {/* Pie con Certificado */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
                                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                <span>Conexión protegida con Spring Security & JWT</span>
                            </div>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
};