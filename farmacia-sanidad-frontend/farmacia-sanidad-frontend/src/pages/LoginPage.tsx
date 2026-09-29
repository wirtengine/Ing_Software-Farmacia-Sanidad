import { lazy, Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, HeartPulse, Pill, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { authService } from '@/api/authService'
import { useAuthStore } from '@/store/authStore'

const HeroPastillas3D = lazy(() => import('@/components/three/HeroPastillas3D').then((m) => ({ default: m.HeroPastillas3D })))

const schema = z.object({
  username: z.string().min(1, 'El usuario es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})
type Form = z.infer<typeof schema>

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [ver, setVer] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) })

  async function onSubmit(data: Form) {
    setLoading(true)
    try {
      const res = await authService.login(data)
      login(res.token, res.usuario)
      toast.success(`¡Bienvenido, ${res.usuario.nombreCompleto.split(' ')[0]}!`)
      navigate(res.usuario.rol === 'VENDEDOR' ? '/pos' : '/')
    } catch {
      // el interceptor muestra el error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel ilustrado */}
      <div className="patron-farmacia relative hidden overflow-hidden bg-gradient-to-br from-mint-100 via-lavender-50 to-blush-50 lg:block">
        <div className="absolute inset-0">
          <Suspense fallback={null}><HeroPastillas3D /></Suspense>
        </div>
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-500 text-white shadow-soft">
              <span className="text-2xl font-bold leading-none">+</span>
            </div>
            <span className="font-serif text-xl text-sage-700">Farmacia Sanidad</span>
          </div>
          <div className="max-w-md">
            <h2 className="font-serif text-4xl leading-tight text-ink">Cuidamos la salud del barrio, tableta por tableta.</h2>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {[
                { i: Pill, t: 'Venta fraccionada' },
                { i: HeartPulse, t: 'Alertas de vencimiento' },
                { i: ShieldCheck, t: 'Control por receta' },
              ].map(({ i: Icon, t }) => (
                <span key={t} className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-ink-muted shadow-soft backdrop-blur">
                  <Icon className="h-4 w-4 text-sage-500" strokeWidth={1.75} /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="tarjeta-vidrio w-full max-w-sm rounded-3xl p-8"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-sage-300 to-sage-600 text-white shadow-soft lg:hidden">
              <span className="text-3xl font-bold leading-none">+</span>
            </div>
            <h1 className="font-serif text-2xl text-ink">¡Hola de nuevo!</h1>
            <p className="mt-1 text-sm text-ink-muted">Iniciá sesión para abrir la farmacia</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" autoFocus autoComplete="username" error={!!errors.username} {...register('username')} />
              {errors.username && <p className="mt-1 text-xs text-danger">{errors.username.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input id="password" type={ver ? 'text' : 'password'} autoComplete="current-password" className="pr-11" error={!!errors.password} {...register('password')} />
                <button
                  type="button"
                  onClick={() => setVer((v) => !v)}
                  aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
                >
                  {ver ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
            </div>
            <Button type="submit" size="lg" className="mt-2 w-full" loading={loading}>Entrar</Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
