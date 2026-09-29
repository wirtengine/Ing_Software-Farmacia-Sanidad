import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#FFFFFF',
          color: '#2C2A26',
          border: '1px solid #E8E2D6',
          borderRadius: '12px',
          fontFamily: 'Inter, sans-serif',
        },
      }}
    />
  )
}
