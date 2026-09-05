# Migraciones con Flyway

Las migraciones se encuentran en \src/main/resources/db/migration/\.

## Convención de nombres
- \V<version>__<descripcion>.sql\
- Ejemplo: \V1__initial_schema.sql\

## Flujo de trabajo
1. Al iniciar la aplicación, Flyway verifica la versión actual de la base de datos.
2. Ejecuta las migraciones pendientes en orden.
3. Si hay error, la transacción se revierte (excepto si se usa \-clean\).

## Para agregar una nueva migración
1. Crear un archivo \V2__agregar_campo.sql\ en la carpeta.
2. Escribir el script DDL (CREATE/ALTER TABLE, etc.).
3. Reiniciar la aplicación para que Flyway la ejecute.

## Comandos útiles
- \./gradlew flywayMigrate\: Ejecuta migraciones manualmente.
- \./gradlew flywayInfo\: Muestra el estado de las migraciones.
- \./gradlew flywayClean\: Borra todas las tablas (¡cuidado!).
