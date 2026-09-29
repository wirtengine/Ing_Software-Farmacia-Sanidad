import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

export const MAX_IMAGEN_BYTES = 5 * 1024 * 1024
export const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp']

export function validarImagen(archivo: File): string | null {
  if (!TIPOS_IMAGEN.includes(archivo.type)) return 'Formato no soportado. Usá JPG, PNG o WebP'
  if (archivo.size > MAX_IMAGEN_BYTES) return 'La imagen no puede superar los 5 MB'
  return null
}

interface ImageUploaderProps {
  currentImageUrl?: string
  /** Si se omite, el componente solo selecciona el archivo (modo "diferido"). */
  onUpload?: (archivo: File, onProgreso: (p: number) => void) => Promise<void>
  onSelect?: (archivo: File | null) => void
  onRemove?: () => Promise<void>
  disabled?: boolean
  className?: string
}

type Estado = 'idle' | 'uploading' | 'success' | 'error'

export function ImageUploader({ currentImageUrl, onUpload, onSelect, onRemove, disabled, className }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [estado, setEstado] = useState<Estado>('idle')
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [progreso, setProgreso] = useState(0)
  const [arrastrando, setArrastrando] = useState(false)

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  const ocupado = disabled || estado === 'uploading'
  const imagen = preview ?? currentImageUrl

  async function procesar(archivo: File) {
    const msg = validarImagen(archivo)
    if (msg) { setEstado('error'); setError(msg); return }
    setError(null)
    setPreview(URL.createObjectURL(archivo))
    onSelect?.(archivo)
    if (!onUpload) return
    setEstado('uploading')
    setProgreso(0)
    try {
      await onUpload(archivo, setProgreso)
      setProgreso(100)
      setEstado('success')
      setTimeout(() => setEstado('idle'), 1600)
    } catch {
      setEstado('error')
      setError('Error al subir la imagen. Intentá de nuevo')
      setPreview(null)
    }
  }

  function abrir() { if (!ocupado) inputRef.current?.click() }

  async function quitar() {
    if (onRemove) {
      try { await onRemove(); setPreview(null) } catch { setError('No se pudo eliminar la imagen') }
    } else {
      setPreview(null)
      onSelect?.(null)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-label="Seleccionar imagen del producto"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) procesar(f); e.target.value = '' }}
      />

      <div
        role="button"
        tabIndex={ocupado ? -1 : 0}
        aria-label="Zona para subir imagen: arrastrá un archivo o presioná Enter"
        onClick={abrir}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir() } }}
        onDragOver={(e) => { e.preventDefault(); if (!ocupado) setArrastrando(true) }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => { e.preventDefault(); setArrastrando(false); const f = e.dataTransfer.files?.[0]; if (f && !ocupado) procesar(f) }}
        className={cn(
          'relative aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-dashed transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
          arrastrando ? 'border-sage-400 bg-mint-50 scale-[1.01]' : 'border-border-strong bg-gradient-to-br from-mint-50 via-white to-lavender-50',
          ocupado ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:border-sage-300'
        )}
      >
        <AnimatePresence mode="wait">
          {imagen ? (
            <motion.img
              key={imagen}
              src={imagen}
              alt="Imagen del producto"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full object-contain bg-white"
            />
          ) : (
            <motion.div
              key="vacio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft"
              >
                <ImagePlus className="h-7 w-7 text-sage-500" strokeWidth={1.75} />
              </motion.div>
              <p className="text-sm font-medium text-ink">Arrastrá una foto o hacé clic</p>
              <p className="text-xs text-ink-subtle">JPG, PNG o WebP · máximo 5 MB</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {estado === 'uploading' && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-sage-900/40 backdrop-blur-[2px]"
            >
              <Loader2 className="h-7 w-7 animate-spin text-white" strokeWidth={1.75} />
              <div className="h-2 w-2/3 overflow-hidden rounded-full bg-white/30">
                <motion.div className="h-full rounded-full bg-white" animate={{ width: `${progreso}%` }} transition={{ duration: 0.2 }} />
              </div>
              <p className="text-xs font-medium text-white">Subiendo… {progreso}%</p>
            </motion.div>
          )}
          {estado === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-sage-600/75"
            >
              <CheckCircle2 className="h-9 w-9 text-white" strokeWidth={1.75} />
              <p className="text-sm font-medium text-white">¡Imagen guardada!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-2 flex items-center gap-1.5 text-xs text-danger"
          >
            <AlertCircle className="h-3.5 w-3.5" strokeWidth={1.75} /> {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" disabled={ocupado} onClick={abrir}>
          <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
          {imagen ? 'Cambiar imagen' : 'Elegir imagen'}
        </Button>
        {imagen && (onRemove || !onUpload) && (
          <Button type="button" size="sm" variant="ghost" className="text-danger" disabled={ocupado} onClick={quitar}>
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} /> Quitar
          </Button>
        )}
      </div>
    </div>
  )
}
