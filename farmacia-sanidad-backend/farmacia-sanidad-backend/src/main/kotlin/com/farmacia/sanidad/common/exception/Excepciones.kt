package com.farmacia.sanidad.common.exception

class RecursoNoEncontradoException(mensaje: String) : RuntimeException(mensaje)
class CodigoDuplicadoException(mensaje: String) : RuntimeException(mensaje)
class ValidacionException(mensaje: String) : RuntimeException(mensaje)
class StockInsuficienteException(mensaje: String) : RuntimeException(mensaje)
class BusinessRuleException(mensaje: String) : RuntimeException(mensaje)
class EstadoInvalidoException(mensaje: String) : RuntimeException(mensaje)
class UnidadInvalidaException(mensaje: String) : RuntimeException(mensaje)
class FraccionamientoInvalidoException(mensaje: String) : RuntimeException(mensaje)
class StorageException(mensaje: String) : RuntimeException(mensaje)
