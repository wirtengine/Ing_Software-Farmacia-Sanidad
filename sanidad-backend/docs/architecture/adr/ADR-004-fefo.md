# ADR-004: Implementación de FEFO (First Expired, First Out)

## Contexto
El manejo de inventario farmacéutico requiere que los productos con fecha de vencimiento más próxima sean los primeros en salir (FEFO). Esto es crítico para reducir pérdidas por vencimientos.

## Decisión
La lógica FEFO se implementa en la base de datos mediante una función PL/pgSQL (n_seleccionar_lotes_fefo y n_registrar_salida_fefo). Spring Boot invoca esta función de manera atómica dentro de una transacción.

## Consecuencias
- La lógica es consistente y reutilizable desde cualquier punto de entrada (ventas, dispensaciones, etc.).
- Se reduce el riesgo de errores de programación al centralizar la regla en la base de datos.
- La aplicación solo orquesta la llamada, delegando la integridad a PostgreSQL.

## Alternativas consideradas
- Implementar FEFO en Kotlin con lógica de ordenamiento en memoria (más propenso a errores y menos atómico).
