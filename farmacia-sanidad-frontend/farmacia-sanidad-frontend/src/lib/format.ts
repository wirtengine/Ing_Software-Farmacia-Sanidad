export function formatCordobas(valor: number | string | undefined | null): string {
  const num = typeof valor === 'string' ? parseFloat(valor) : valor ?? 0
  return new Intl.NumberFormat('es-NI', {
    style: 'currency',
    currency: 'NIO',
    minimumFractionDigits: 2,
  }).format(num)
}

export function formatFecha(fecha: string | Date | undefined | null): string {
  if (!fecha) return '—'
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  return new Intl.DateTimeFormat('es-NI', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function formatFechaHora(fecha: string | Date | undefined | null): string {
  if (!fecha) return '—'
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  return new Intl.DateTimeFormat('es-NI', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatNumero(valor: number | undefined | null): string {
  return new Intl.NumberFormat('es-NI').format(valor ?? 0)
}

export const UNIDAD_LABELS: Record<string, string> = {
  CAJA: 'Caja',
  BLISTER: 'Blíster',
  TABLETA: 'Tableta',
  FRASCO: 'Frasco',
  AMPOLLA: 'Ampolla',
  SOBRE: 'Sobre',
  TUBO: 'Tubo',
  UNIDAD: 'Unidad',
  MILILITRO: 'Mililitro',
  GRAMO: 'Gramo',
}

export const ROL_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  REGENTE: 'Regente',
  VENDEDOR: 'Vendedor',
}
