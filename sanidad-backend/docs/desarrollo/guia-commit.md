# Guía de Commits

## Conventional Commits
Usamos el formato [Conventional Commits](https://www.conventionalcommits.org/).

## Tipos comunes
- \eat\: Nueva funcionalidad (ej. \eat(medicamento): agregar CRUD de productos\)
- \ix\: Corrección de bug (\ix(ventas): resolver error en cálculo de vuelto\)
- \docs\: Cambios en documentación (\docs: actualizar README\)
- \	est\: Agregar o modificar pruebas (\	est(auth): agregar pruebas de login\)
- \efactor\: Refactorización sin cambios funcionales (\efactor(inventario): simplificar lógica FEFO\)
- \chore\: Tareas de mantenimiento (\chore: actualizar dependencias\)
- \perf\: Mejora de rendimiento
- \security\: Cambios relacionados con seguridad

## Ejemplos
\\\
feat(auth): implementar registro de usuarios
fix(inventario): impedir salida sin stock suficiente
docs: agregar diagrama de casos de uso
test(ventas): cubrir escenario de anulación
refactor(lote): extraer lógica de validación a servicio
chore: actualizar Spring Boot a 3.3.4
\\\

## Buenas prácticas
- Cada commit debe ser una unidad lógica de cambio.
- Incluir referencias a requisitos o issues cuando sea posible.
- Usar el cuerpo del commit para explicar el por qué, no solo el qué.
