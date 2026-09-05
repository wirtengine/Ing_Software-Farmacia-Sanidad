import React, { useState, useEffect, useCallback } from 'react';
import { userService } from '../api/userService';
import type { UserDto, UserRole } from '../types/auth';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuthContext } from '../context/useAuthContext';
import {
    User,
    Lock,
    UserCheck,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Loader2,
    ArrowLeft,
    UserPlus,
    UserX,
    KeyRound,
    ShieldAlert,
    Search,
    RefreshCw,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const UsersPage: React.FC = () => {
    const { user: currentUser } = useAuthContext();

    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Formulario de Registro
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        nombreCompleto: '',
        password: '',
        rol: 'VENDEDOR' as UserRole,
    });

    // Modal Cambiar Contraseña
    const [selectedUserForPassword, setSelectedUserForPassword] = useState<UserDto | null>(null);
    const [newPassword, setNewPassword] = useState('');

    // Cargar usuarios activos
    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getAllUsers();
            if (Array.isArray(data)) {
                setUsers(data.filter((u) => u && typeof u === 'object' && Boolean(u.activo)));
            } else {
                setUsers([]);
            }
        } catch {
            setError('No se pudo obtener la lista de usuarios desde el servidor.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (isMounted) {
                await loadUsers();
            }
        };

        void fetchData();

        return () => {
            isMounted = false;
        };
    }, [loadUsers]);

    // Handler: Crear Usuario
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await userService.createUser(formData);
            setSuccess(`Usuario '${formData.username}' creado con éxito.`);
            setShowRegisterModal(false);
            setFormData({ username: '', nombreCompleto: '', password: '', rol: 'VENDEDOR' });
            await loadUsers();
        } catch {
            setError('Error al registrar usuario. El nombre de usuario puede estar duplicado.');
        } finally {
            setActionLoading(false);
        }
    };

    // Handler: Desactivar Usuario (Validación de seguridad: Admin no puede desactivarse a sí mismo)
    const handleDeactivate = async (targetUser: UserDto) => {
        if (currentUser && (targetUser.id === currentUser.id || targetUser.username === currentUser.username)) {
            setError('Acción no permitida: No puedes desactivar tu propia cuenta activa.');
            return;
        }

        if (!window.confirm(`¿Confirmas desactivar al usuario '@${targetUser.username}'? No podrá acceder al sistema.`)) {
            return;
        }

        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await userService.deactivateUser(targetUser.id);
            setSuccess(`Usuario '@${targetUser.username}' desactivado correctamente.`);
            await loadUsers();
        } catch {
            setError(`No se pudo desactivar al usuario '@${targetUser.username}'.`);
        } finally {
            setActionLoading(false);
        }
    };

    // Handler: Cambiar Rol (Validación de seguridad: Admin no puede cambiar su propio rol)
    const handleChangeRole = async (targetUser: UserDto, nuevoRol: UserRole) => {
        if (currentUser && (targetUser.id === currentUser.id || targetUser.username === currentUser.username)) {
            setError('Acción no permitida: No puedes modificar tu propio rol de acceso.');
            return;
        }

        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await userService.changeUserRole(targetUser.id, nuevoRol);
            setSuccess(`Rol actualizado correctamente a '${nuevoRol}' para '@${targetUser.username}'.`);
            await loadUsers();
        } catch {
            setError('No se pudo cambiar el rol del usuario.');
        } finally {
            setActionLoading(false);
        }
    };

    // Handler: Cambiar Contraseña
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserForPassword) return;

        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await userService.changeUserPassword(selectedUserForPassword.id, newPassword);
            setSuccess(`Contraseña restablecida para '@${selectedUserForPassword.username}'.`);
            setSelectedUserForPassword(null);
            setNewPassword('');
        } catch {
            setError('Error al actualizar la contraseña.');
        } finally {
            setActionLoading(false);
        }
    };

    // Búsqueda defensiva
    const filteredUsers = users.filter((u) => {
        if (!u) return false;

        const query = (searchTerm || '').toLowerCase().trim();
        if (!query) return true;

        const usernameStr = u.username ? String(u.username).toLowerCase() : '';
        const nombreStr = u.nombreCompleto ? String(u.nombreCompleto).toLowerCase() : '';
        const rolStr = u.rol ? String(u.rol).toLowerCase() : '';

        return usernameStr.includes(query) || nombreStr.includes(query) || rolStr.includes(query);
    });

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* CABECERA DE LA PÁGINA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
                    <div>
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 mb-2 transition">
                            <ArrowLeft className="h-4 w-4" /> Volver al Dashboard
                        </Link>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gestión de Usuarios y Roles</h1>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Administración centralizada de cuentas de personal y asignación de permisos RBAC
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadUsers}
                            disabled={loading}
                            className="p-2.5 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-2xl border border-emerald-200/80 transition shadow-xs cursor-pointer"
                            title="Recargar lista"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={() => setShowRegisterModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-600/20 text-xs cursor-pointer transform hover:-translate-y-0.5"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Registrar Empleado</span>
                        </button>
                    </div>
                </div>

                {/* MENSAJES DE ALERTA */}
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold animate-shake">
                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                        <p>{success}</p>
                    </div>
                )}

                {/* BUSCADOR */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre, usuario o rol..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-emerald-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition font-medium shadow-xs"
                    />
                </div>

                {/* TABLA DE USUARIOS */}
                <div className="bg-white/90 backdrop-blur-md border border-emerald-100 rounded-3xl overflow-hidden shadow-xl shadow-emerald-950/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-emerald-50/80 border-b border-emerald-100 text-slate-500 uppercase text-[11px] font-black tracking-wider">
                            <tr>
                                <th className="py-4 px-6">Empleado / Usuario</th>
                                <th className="py-4 px-6">Rol de Acceso</th>
                                <th className="py-4 px-6">Estado</th>
                                <th className="py-4 px-6 text-right">Acciones de Control</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-600" />
                                        Cargando personal activo...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                                        No se encontraron usuarios activos en el sistema.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => {
                                    // ✅ FIX: se envuelve en Boolean(...) para que el resultado
                                    // siempre sea "boolean" y nunca "boolean | null".
                                    // Antes: currentUser && (...) devolvía `null` cuando currentUser era null,
                                    // y `disabled` no acepta `null`, solo `boolean | undefined`.
                                    const isSelf = Boolean(
                                        currentUser && (u.id === currentUser.id || u.username === currentUser.username)
                                    );

                                    return (
                                        <tr key={u.id || u.username} className="hover:bg-emerald-50/40 transition">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-emerald-100/60 text-emerald-800 rounded-2xl border border-emerald-200/60 font-bold">
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800">
                                                            {u.nombreCompleto || 'Sin Nombre'}
                                                            {isSelf && (
                                                                <span className="ml-2 px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded-md font-extrabold">
                                                                    Sesión Actual
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-[11px] font-medium text-slate-400">@{u.username || 'usuario'}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6">
                                                <select
                                                    value={u.rol || 'VENDEDOR'}
                                                    onChange={(e) => handleChangeRole(u, e.target.value as UserRole)}
                                                    disabled={actionLoading || isSelf}
                                                    title={isSelf ? 'No puedes cambiar tu propio rol' : 'Cambiar rol'}
                                                    className={`bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs font-bold px-3 py-1.5 text-emerald-800 focus:bg-white focus:border-emerald-500 outline-none transition ${
                                                        isSelf ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                    }`}
                                                >
                                                    <option value="VENDEDOR">VENDEDOR</option>
                                                    <option value="REGENTE">REGENTE</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Activo
                                                </span>
                                            </td>

                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedUserForPassword(u)}
                                                        className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl border border-amber-200 transition cursor-pointer"
                                                        title="Restablecer Contraseña"
                                                    >
                                                        <KeyRound className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeactivate(u)}
                                                        disabled={actionLoading || isSelf}
                                                        className={`p-2 rounded-xl border transition ${
                                                            isSelf
                                                                ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed opacity-50'
                                                                : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200 cursor-pointer'
                                                        }`}
                                                        title={isSelf ? 'No puedes desactivar tu propia cuenta' : 'Desactivar Usuario (Baja Lógica)'}
                                                    >
                                                        <UserX className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL: REGISTRAR EMPLEADO */}
                {showRegisterModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white border border-emerald-100 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-fade-in">
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="font-extrabold text-lg">Nuevo Empleado</h3>
                                    <p className="text-xs text-emerald-100">Crear cuenta autorizada en el sistema</p>
                                </div>
                                <button
                                    onClick={() => setShowRegisterModal(false)}
                                    className="p-1 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleRegister} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Nombre Completo</label>
                                    <div className="relative">
                                        <UserCheck className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.nombreCompleto}
                                            onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                                            placeholder="Ej. Carlos Mendoza"
                                            className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Usuario (Login)</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="Ej. cmendoza"
                                            className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Contraseña Inicial</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Rol Inicial</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                        <select
                                            value={formData.rol}
                                            onChange={(e) => setFormData({ ...formData, rol: e.target.value as UserRole })}
                                            className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-semibold cursor-pointer"
                                        >
                                            <option value="VENDEDOR">VENDEDOR - Ventas de mostrador</option>
                                            <option value="REGENTE">REGENTE - Dispensación con receta</option>
                                            <option value="ADMIN">ADMINISTRADOR - Control total</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowRegisterModal(false)}
                                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
                                    >
                                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar Empleado'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: RESTABLECER CONTRASEÑA */}
                {selectedUserForPassword && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white border border-emerald-100 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
                            <div className="flex items-center gap-3 text-amber-600">
                                <ShieldAlert className="h-6 w-6" />
                                <h3 className="font-extrabold text-slate-800">Restablecer Clave</h3>
                            </div>

                            <p className="text-xs text-slate-500 font-medium">
                                Modificando contraseña para <strong className="text-slate-800">@{selectedUserForPassword.username}</strong>.
                            </p>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:bg-white focus:border-emerald-500 font-medium"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedUserForPassword(null)}
                                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 cursor-pointer"
                                    >
                                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Actualizar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
