# Farmacia Sanidad — Frontend

React 18 · TypeScript · Vite · TailwindCSS · Framer Motion · React Three Fiber
Diseño **"Botanical Warm"** en pasteles (menta, lavanda, rosa, cielo y mantequilla) con estilo de farmacia.

## Novedades de esta versión

- 🎨 Paleta pastel nueva, tarjetas tipo vidrio, fondo con degradados suaves y patrón de cruces.
- 🧭 Menú lateral agrupado (Mostrador / Inventario / Gestión) con iconos de colores y modo contraído.
- 💊 Login con escena 3D de cápsulas y cruces flotando.
- 🧊 3D procedural mejorado (sin archivos .glb):
  - Caja, frasco ámbar, tabletas, blíster con alvéolos, ampolla, sobre, tubo y cápsulas.
  - La **foto del producto se aplica como textura** (etiqueta del frasco, frente de la caja, etc.).
  - Mapa de estantes con muebles, repisas, cajitas de colores, letreros y sombras.
- 🖼️ **Subida de imágenes a Supabase Storage** (arrastrar y soltar, vista previa, barra de progreso real,
  validación de 5 MB y JPG/PNG/WebP). Disponible en *Nuevo producto* y en el detalle del producto (solo ADMIN).
- 📊 Panel con gráfico de ventas de los últimos 7 días.
- ✅ Ajustado a las reglas del backend: solo ADMIN abre caja y registra lotes; las devoluciones las
  registra ADMIN/REGENTE; la devolución a proveedor pide el lote; los medicamentos exigen código sanitario,
  nombre genérico y presentación; la dispensación exige médico prescriptor.

## Requisitos

- **Node.js 18 o superior** (recomendado 20 LTS): https://nodejs.org
- **IntelliJ IDEA Ultimate** (trae soporte para JavaScript/TypeScript y npm).
  En la versión Community también funciona abriendo la carpeta y usando la terminal integrada.
- El **backend** corriendo en `http://localhost:8080/api`.

## Correrlo en IntelliJ IDEA

1. Descomprimí el zip. Queda la carpeta `farmacia-sanidad-frontend`.
2. En IntelliJ: `File → Open…` → seleccioná la carpeta `farmacia-sanidad-frontend` → **Open**.
   (Si ya tenés abierto el backend, elegí **New Window**.)
3. Verificá Node: `Settings → Languages & Frameworks → Node.js` → *Node interpreter* debe apuntar a tu Node 18+.
4. Instalá dependencias:
   - Abrí `package.json`, IntelliJ muestra el aviso **"Run 'npm install'"** → clic.
   - O en la terminal integrada (`Alt+F12`): `npm install`
5. Revisá el archivo `.env.local` (ya viene creado):
   ```
   VITE_API_URL=http://localhost:8080/api
   ```
6. Ejecutá:
   - Abrí `package.json`, clic en el ▶ verde junto al script **`dev`**, o
   - en la terminal: `npm run dev`
7. Abrí **http://localhost:5173** en el navegador.

> El backend permite por defecto el origen `http://localhost:5173` (CORS). Si usás otro puerto,
> configurá `CORS_ORIGINS` en el backend.

## Primer ingreso

Si la base está vacía, creá el primer administrador desde Swagger del backend
(`http://localhost:8080/api/swagger-ui.html`) con `POST /auth/register`:

```json
{ "username": "admin", "nombreCompleto": "Administrador", "password": "Admin123", "rol": "ADMIN" }
```

Después entrá al sistema con ese usuario y creá el resto desde **Usuarios**.

## Flujo recomendado para probar

1. **Estantes** → crear `A-01`, `A-02`, `B-01` (ver el **Mapa 3D**).
2. **Productos → Nuevo producto** → elegir foto → guardar.
3. En el detalle del producto, agregar unidades (ej. *Blíster* con factor 10 y *Caja* con factor 100).
4. **Lotes → Registrar lote** (ADMIN) con la cantidad en unidad base.
5. **Caja → Abrir caja** (ADMIN).
6. **Punto de venta** → buscar, elegir unidad (tableta/blíster/caja) → cobrar.

## Subida de imágenes

- La imagen se envía al backend (`POST /api/productos/{id}/imagen`) y el backend la guarda en
  Supabase Storage (bucket `productos`). **El frontend nunca usa la Service Role Key.**
- Si al subir aparece *"El almacenamiento de imágenes no está configurado"*, falta la variable
  `SUPABASE_SERVICE_KEY` en el backend.

## Scripts

```bash
npm run dev       # desarrollo en http://localhost:5173
npm run build     # compilación de producción (carpeta dist/)
npm run preview   # sirve la compilación
```

## Problemas comunes

| Problema | Solución |
|---|---|
| "No se pudo conectar con el servidor" | El backend no está corriendo o `VITE_API_URL` es incorrecta. |
| Pantalla de 403 al entrar | Tu rol no tiene acceso a esa sección (el VENDEDOR entra directo al Punto de venta). |
| El 3D se ve en blanco | Actualizá los drivers de video o probá en Chrome/Edge (requiere WebGL). |
| La foto no aparece en el 3D | Verificá que el bucket `productos` de Supabase sea **público**. |
