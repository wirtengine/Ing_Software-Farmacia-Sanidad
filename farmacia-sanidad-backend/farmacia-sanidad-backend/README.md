# Farmacia Sanidad — Backend

Kotlin 1.9.24 · Spring Boot 3.3.4 · **Java 17** · Gradle 8.10.2 · PostgreSQL (Supabase)

## 1. Preparar la base de datos (una sola vez)

Tu script `farmacia_sanidad_database.sql` no tiene las tablas de **estantes** ni de
**unidades de venta (fraccionamiento)**. Abrí Supabase → *SQL Editor* y ejecutá:

```
sql/01_estantes_y_fraccionamiento.sql
```

Es idempotente: si ya existen las tablas/columnas, no hace nada.

## 2. Abrir en IntelliJ IDEA

1. `File → Open…` y seleccioná la carpeta `farmacia-sanidad-backend` (la que tiene `build.gradle.kts`).
2. Elegí **Open as Project** y esperá a que Gradle sincronice (descarga Gradle 8.10.2 y dependencias).
3. `File → Project Structure → Project → SDK`: seleccioná un **JDK 17**
   (si no tenés, *Add SDK → Download JDK → version 17*).
4. `Settings → Build, Execution, Deployment → Build Tools → Gradle → Gradle JVM`: **Project SDK (17)**.

## 3. Variables de entorno

Ya viene una configuración de ejecución lista: **FarmaciaSanidadBackend** (arriba a la derecha).
`Run → Edit Configurations… → FarmaciaSanidadBackend → Environment variables` y reemplazá:

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DB_PASSWORD` | Sí | Contraseña de la base de datos de Supabase |
| `SUPABASE_SERVICE_KEY` | Solo para subir imágenes | Service Role Key (**rotala**, la anterior quedó expuesta) |
| `JWT_SECRET` | Recomendada | Clave de al menos 32 caracteres |
| `DB_URL` | No | Para usar otra URL (ver "Problemas comunes") |

Luego dale ▶ Run. La API queda en `http://localhost:8080/api` y Swagger en
`http://localhost:8080/api/swagger-ui.html`.

### Desde PowerShell (opcional)

```powershell
$env:DB_PASSWORD="tu-password"
$env:SUPABASE_SERVICE_KEY="tu-service-role-key-nueva"
gradle wrapper            # solo la primera vez, si no tenés gradlew.bat
.\gradlew.bat bootRun
```

## 4. Primer usuario

Mientras no exista ningún usuario, `POST /api/auth/register` es libre:

```json
{ "username": "admin", "nombreCompleto": "Administrador", "password": "Admin123", "rol": "ADMIN" }
```

Después de eso, solo un ADMIN autenticado puede registrar usuarios.

## Reglas que impone tu base de datos (importante)

- **Registrar lotes** y **abrir caja** solo lo puede hacer un **ADMIN** (lo exigen `fn_registrar_entrada_lote` y `fn_abrir_caja`).
- Hay **una sola caja abierta** para toda la farmacia; los vendedores venden sobre esa caja.
- Toda **devolución** debe autorizarla un ADMIN o REGENTE.
- Un **medicamento** requiere código sanitario, nombre genérico y presentación.
- Las ventas descuentan en **unidad base** (2 blísteres × factor 10 = 20 tabletas) con **FEFO**.
- Al crear un producto se genera automáticamente su unidad de venta base con el precio base.

## Problemas comunes

- **No conecta a Supabase / `UnknownHostException`**: el host directo `db.xxx.supabase.co` usa IPv6.
  En Supabase → *Connect* → copiá la URL del **Session pooler** y ponela en `DB_URL`, agregando
  `&stringtype=unspecified` al final. Ejemplo:
  `jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require&stringtype=unspecified`
  y `DB_USERNAME=postgres.oqhowdjidqswyeygpksx`.
- **`column "x" is of type farmacia.xxx but expression is of type character varying`**: falta
  `stringtype=unspecified` en la URL.
- **`relation "farmacia.estantes" does not exist`**: no ejecutaste el script del paso 1.
- **Subir imagen responde "no está configurado"**: falta `SUPABASE_SERVICE_KEY`.
