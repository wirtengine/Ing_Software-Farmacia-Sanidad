package com.farmacia.sanidad.auth.mapper

import com.farmacia.sanidad.auth.dto.UserDto
import com.farmacia.sanidad.auth.entity.Usuario
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.mapstruct.factory.Mappers

/**
 * Mapper para convertir entre la entidad [Usuario] y el DTO [UserDto].
 * Usa MapStruct para generar la implementación en tiempo de compilación.
 *
 * @see UserDto
 * @see Usuario
 */
@Mapper(componentModel = "spring")
interface UserMapper {

    /**
     * Instancia para uso en pruebas o cuando no se dispone de inyección.
     */
    companion object {
        val INSTANCE: UserMapper = Mappers.getMapper(UserMapper::class.java)
    }

    /**
     * Convierte una entidad [Usuario] a un [UserDto].
     * MapStruct maneja automáticamente la conversión de tipos básicos.
     *
     * @param entity entidad de usuario
     * @return DTO correspondiente
     */
    @Mapping(target = "id", expression = "java(entity.getId().toString())")
    fun toDto(entity: Usuario): UserDto

    /**
     * Convierte un [UserDto] a una entidad [Usuario].
     * Los campos que no deben ser mapeados se ignoran (contraseña, timestamps).
     *
     * @param dto DTO de usuario
     * @return entidad correspondiente
     */
    @Mapping(target = "id", expression = "java(java.util.UUID.fromString(dto.getId()))")
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    fun toEntity(dto: UserDto): Usuario
}