# Estrategia de Ramas

## Ramas principales
- \main\: Código estable, listo para producción.
- \develop\: Integración de funcionalidades en desarrollo.

## Ramas de funcionalidad
- \eature/<nombre>\: Para nuevas funcionalidades (ej. \eature/medicamento-crud\).
- \ugfix/<nombre>\: Para correcciones de bugs.
- \hotfix/<nombre>\: Para correcciones urgentes en producción.

## Flujo de trabajo
1. Crear rama desde \develop\ (o \main\ para hotfix).
2. Desarrollar y hacer commits.
3. Abrir Pull Request hacia \develop\ (o \main\).
4. Revisión de código y pruebas.
5. Fusionar y eliminar rama.

## Reglas
- No se permite fusionar a \main\ sin revisión.
- Mantener \main\ siempre desplegable.
- Usar nombres descriptivos para las ramas.
