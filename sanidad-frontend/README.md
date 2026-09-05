# 🏥 Farmacia Sanidad — Backend

<div align="center">

### 💊 Sistema Web para el Control de Ventas e Inventario con Alertas Automáticas

**Backend desarrollado con Kotlin + Spring Boot**

[![Kotlin](https://img.shields.io/badge/Kotlin-1.9.24-7F52FF?style=for-the-badge\&logo=kotlin\&logoColor=white)](https://kotlinlang.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=for-the-badge\&logo=springboot\&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge\&logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)](https://supabase.com/)
[![Gradle](https://img.shields.io/badge/Gradle-8.10+-02303A?style=for-the-badge\&logo=gradle\&logoColor=white)](https://gradle.org/)

</div>

---

## 📋 Tabla de Contenidos

* [📖 Descripción](#-descripción)
* [✨ Características](#-características-principales)
* [🛠️ Tecnologías](#️-tecnologías)
* [🏗️ Arquitectura](#️-arquitectura-del-proyecto)
* [🗂️ Estructura del Proyecto](#️-estructura-del-proyecto)
* [⚙️ Requisitos Previos](#️-requisitos-previos)
* [🔧 Configuración](#-configuración)
* [🚀 Ejecución](#-ejecución-del-proyecto)
* [📚 Documentación de la API](#-documentación-de-la-api)
* [🔐 Seguridad](#-seguridad-y-roles)
* [👥 Equipo](#-equipo)
* [📄 Licencia](#-licencia)

---

# 📖 Descripción

**Farmacia Sanidad** es un sistema web diseñado para optimizar y automatizar los procesos relacionados con la gestión de ventas, medicamentos e inventario de una farmacia.

El backend proporciona una **API REST** encargada de gestionar la lógica de negocio, la seguridad, la persistencia de datos y la comunicación con el sistema frontend.

El proyecto busca contribuir a la solución de problemas comunes dentro de la gestión farmacéutica, tales como:

> ⚠️ Pérdidas económicas por medicamentos vencidos.
> ⚠️ Desabastecimiento de productos.
> ⚠️ Diferencias entre el inventario físico y el registrado.
> ⚠️ Procesos manuales que consumen demasiado tiempo.
> ⚠️ Dificultades para tomar decisiones relacionadas con las compras.

---

# ✨ Características Principales

El sistema cuenta con funcionalidades orientadas a la automatización y control de los procesos principales de la farmacia.

### 💊 Gestión de Medicamentos

* Registro y actualización de medicamentos.
* Clasificación de productos.
* Control de existencias.
* Gestión de precios.
* Control de medicamentos activos e inactivos.

### 📦 Gestión de Inventario

* Control automático de entradas y salidas.
* Gestión de lotes.
* Control de fechas de vencimiento.
* Aplicación de la estrategia **FEFO**.
* Historial de movimientos de inventario.

### 🛒 Gestión de Ventas

* Registro de ventas.
* Gestión de detalles de venta.
* Actualización automática del inventario.
* Registro de clientes.
* Emisión de comprobantes internos.

### 📋 Gestión de Recetas

* Registro de recetas médicas.
* Control de medicamentos que requieren receta.
* Registro de dispensaciones.
* Trazabilidad de medicamentos regulados.

### 🔄 Gestión de Devoluciones

* Devoluciones realizadas por clientes.
* Devoluciones hacia proveedores.
* Actualización automática del inventario.

### 🚨 Sistema de Alertas

El sistema genera alertas automáticas relacionadas con:

* 📉 Stock crítico.
* ⏳ Medicamentos próximos a vencer.
* ❌ Medicamentos vencidos.
* 📦 Productos con baja disponibilidad.

### 🧠 Sistema de Recomendaciones

Mediante reglas de negocio y el análisis del historial de ventas, el sistema puede generar recomendaciones relacionadas con:

* 🛒 Compra de productos.
* 🔥 Liquidación de productos.
* 🚫 Descontinuación de productos.

### 📊 Dashboard y Reportes

* Resumen general de ventas.
* Estado actual del inventario.
* Productos más vendidos.
* Productos con baja rotación.
* Medicamentos próximos a vencer.
* Indicadores para apoyar la toma de decisiones.

---

# 🛠️ Tecnologías

| Tecnología           | Versión | Propósito                       |
| :------------------- | :-----: | :------------------------------ |
| 🟣 Kotlin            |  1.9.24 | Lenguaje principal del backend  |
| 🌱 Spring Boot       |  3.3.4  | Framework principal             |
| 🔐 Spring Security   |   6.x   | Autenticación y autorización    |
| 🔑 JWT               |  0.12.6 | Gestión de tokens               |
| 🗄️ Spring Data JPA  |  3.3.4  | Persistencia y acceso a datos   |
| 🐘 PostgreSQL        |    16   | Sistema gestor de base de datos |
| ⚡ Supabase           |    —    | Plataforma de base de datos     |
| 🔄 Flyway            |   10.x  | Migraciones de base de datos    |
| 🗺️ MapStruct        |  1.5.5  | Mapeo de objetos                |
| 📚 OpenAPI / Swagger |  2.6.0  | Documentación de la API         |
| 🐘 Gradle            |  8.10+  | Gestión de dependencias         |

---

# 🏗️ Arquitectura del Proyecto

El backend sigue una arquitectura modular basada en responsabilidades, permitiendo una mejor organización, mantenimiento y escalabilidad del sistema.

```text
┌──────────────────────────────┐
│         CLIENTE WEB          │
│      React + TypeScript      │
└──────────────┬───────────────┘
               │
               │ HTTP / REST
               ▼
┌──────────────────────────────┐
│         API BACKEND          │
│     Spring Boot + Kotlin     │
│                              │
│  ┌────────────────────────┐  │
│  │     Controllers        │  │
│  ├────────────────────────┤  │
│  │      Services          │  │
│  ├────────────────────────┤  │
│  │   Business Rules       │  │
│  ├────────────────────────┤  │
│  │    Repositories        │  │
│  └────────────────────────┘  │
└──────────────┬───────────────┘
               │
               │ JPA / Hibernate
               ▼
┌──────────────────────────────┐
│       PostgreSQL             │
│        Supabase              │
└──────────────────────────────┘
```

### Principios aplicados

* 🧩 Arquitectura modular.
* 🔗 Separación de responsabilidades.
* 🛡️ Seguridad basada en JWT.
* 🔄 Migraciones versionadas con Flyway.
* 📦 DTO para transferencia de datos.
* 🗺️ MapStruct para conversión de objetos.
* ⚠️ Manejo centralizado de excepciones.
* 📝 Documentación mediante OpenAPI.

---

# 🗂️ Estructura del Proyecto

```text
src
└── main
    └── kotlin
        └── com
            └── farmacia
                └── sanidad
                    │
                    ├── auth/
                    │   ├── controller/      # Endpoints de autenticación
                    │   ├── service/         # Lógica de negocio
                    │   ├── repository/      # Acceso a datos
                    │   ├── entity/          # Entidades de usuarios
                    │   ├── dto/             # DTOs de autenticación
                    │   ├── mapper/          # Conversión de objetos
                    │   └── security/        # JWT y configuración de seguridad
                    │
                    ├── medicamento/         # Gestión de medicamentos
                    │
                    ├── proveedor/           # Gestión de proveedores
                    │
                    ├── lote/                # Gestión de lotes
                    │
                    ├── inventario/          # Movimientos y control de inventario
                    │
                    ├── ventas/              # Ventas y detalles de venta
                    │
                    ├── clientes/            # Gestión de clientes
                    │
                    ├── recetas/             # Recetas y dispensaciones
                    │
                    ├── devoluciones/        # Devoluciones
                    │
                    ├── alertas/             # Alertas automáticas
                    │
                    ├── recomendaciones/     # Recomendaciones automáticas
                    │
                    ├── dashboard/           # Indicadores gerenciales
                    │
                    ├── reportes/            # Generación de reportes
                    │
                    ├── auditoria/           # Auditoría y registros
                    │
                    └── common/
                        ├── config/          # Configuraciones generales
                        ├── exception/       # Manejo de excepciones
                        └── util/            # Utilidades compartidas
```

> 💡 **Nota:** Cada módulo puede organizarse internamente utilizando su propia estructura de `controller`, `service`, `repository`, `dto`, `entity` y `mapper`, dependiendo de sus necesidades.

---

# ⚙️ Requisitos Previos

Antes de ejecutar el proyecto debes tener instalado:

* ☕ JDK 17 o superior.
* 🟣 Kotlin.
* 🐘 PostgreSQL o una cuenta en Supabase.
* 🐘 Gradle 8.10 o superior.
* 💻 IntelliJ IDEA, Visual Studio Code u otro IDE compatible.

Puedes verificar las versiones instaladas mediante:

```bash
java -version
```

```bash
gradle -version
```

---

# 🔧 Configuración

## 1️⃣ Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

Accede posteriormente al directorio del proyecto:

```bash
cd Farmacia-Sanidad-Backend
```

---

## 2️⃣ Configurar las variables de entorno

Crea o configura las variables necesarias para establecer la conexión con la base de datos.

Ejemplo:

```properties
SPRING_DATASOURCE_URL=jdbc:postgresql://HOST:5432/DATABASE
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=tu_contraseña

JWT_SECRET=tu_clave_secreta
JWT_EXPIRATION=86400000
```

> ⚠️ **Importante:** Nunca subas credenciales reales, contraseñas o claves secretas al repositorio.

---

## 3️⃣ Configurar la aplicación

Ejemplo de configuración en `application.yml`:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}

  jpa:
    hibernate:
      ddl-auto: validate

  flyway:
    enabled: true
```

---

# 🚀 Ejecución del Proyecto

Para ejecutar la aplicación en modo desarrollo:

### Windows

```bash
gradlew.bat bootRun
```

### Linux / macOS

```bash
./gradlew bootRun
```

La aplicación estará disponible en:

```text
http://localhost:8080
```

---

# 📚 Documentación de la API

La documentación interactiva de los endpoints estará disponible mediante **Swagger UI**.

```text
http://localhost:8080/swagger-ui/index.html
```

También se puede acceder a la especificación OpenAPI mediante:

```text
http://localhost:8080/v3/api-docs
```

---

# 🔐 Seguridad y Roles

El sistema implementa autenticación basada en **JSON Web Tokens (JWT)**.

Después de iniciar sesión, el usuario recibe un token que debe ser enviado en las solicitudes protegidas:

```http
Authorization: Bearer <token>
```

## Roles del Sistema

| Rol             | Descripción                                       |
| :-------------- | :------------------------------------------------ |
| 👑 **ADMIN**    | Gestión general y configuración del sistema       |
| 💊 **REGENTE**  | Supervisión de medicamentos, recetas e inventario |
| 🛒 **VENDEDOR** | Registro y gestión de ventas                      |

---

# 🗄️ Base de Datos

El proyecto utiliza **PostgreSQL** como sistema gestor de base de datos.

Las principales entidades del sistema incluyen:

```text
Usuario
Rol
Medicamento
Categoría
Proveedor
Lote
Inventario
MovimientoInventario
Venta
DetalleVenta
Cliente
Receta
Dispensación
Devolución
Alerta
Recomendación
Auditoría
```

Las modificaciones en la estructura de la base de datos son gestionadas mediante **Flyway**, permitiendo mantener un historial de las migraciones.

---

# 🧪 Pruebas

Para ejecutar las pruebas automatizadas:

```bash
./gradlew test
```

En Windows:

```bash
gradlew.bat test
```

---

# 📌 Convenciones del Proyecto

### 📂 Organización

Cada módulo debe mantener una separación clara entre:

```text
controller → service → repository
```

### 📝 Nombres

* Clases: `PascalCase`
* Funciones y variables: `camelCase`
* Constantes: `UPPER_SNAKE_CASE`
* Endpoints REST: `kebab-case`

Ejemplo:

```text
/api/medicamentos
/api/movimientos-inventario
/api/ventas
```

---

# 🗺️ Roadmap

* [x] Configuración inicial del proyecto.
* [x] Configuración de PostgreSQL.
* [x] Integración con Spring Boot.
* [x] Configuración de seguridad.
* [ ] Módulo de autenticación.
* [ ] Gestión de medicamentos.
* [ ] Gestión de inventario.
* [ ] Gestión de ventas.
* [ ] Gestión de recetas.
* [ ] Sistema de alertas.
* [ ] Sistema de recomendaciones.
* [ ] Dashboard gerencial.
* [ ] Generación de reportes.
* [ ] Pruebas automatizadas.
* [ ] Despliegue del sistema.

---

# 👥 Equipo

Este proyecto forma parte de un trabajo académico desarrollado para la asignatura:

### 🎓 Ingeniería de Software I

**Universidad:** Universidad Nacional de Ingeniería
**Ubicación:** Managua, Nicaragua

### 👨‍💻 Desarrollador

**Wilberth Alejandro Pérez Loredo**

---

# 📄 Licencia

Este proyecto ha sido desarrollado con fines **académicos y educativos**.

---

<div align="center">

### 🏥 Farmacia Sanidad

**Tecnología para una gestión farmacéutica más eficiente, segura e inteligente.**

⭐ Si te gusta el proyecto, considera darle una estrella al repositorio.

</div>
