-- =====================================================================
-- Farmacia Sanidad - Script complementario (idempotente)
-- Ejecutar UNA VEZ en Supabase > SQL Editor antes de arrancar el backend.
-- Agrega: estantes, unidades de venta (fraccionamiento) y columnas nuevas.
-- Se puede ejecutar varias veces sin romper nada.
-- =====================================================================

do $$ begin
    create type farmacia.unidad_medida as enum
        ('CAJA','BLISTER','TABLETA','FRASCO','AMPOLLA','SOBRE','TUBO','UNIDAD','MILILITRO','GRAMO');
exception when duplicate_object then null; end $$;

create table if not exists farmacia.estantes (
    id uuid primary key default gen_random_uuid(),
    codigo varchar(30) not null unique,
    descripcion varchar(255),
    ubicacion_fisica varchar(255),
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table farmacia.productos add column if not exists estante_id uuid references farmacia.estantes(id);
alter table farmacia.productos add column if not exists unidad_base farmacia.unidad_medida;

create table if not exists farmacia.producto_unidades (
    id uuid primary key default gen_random_uuid(),
    producto_id uuid not null references farmacia.productos(id),
    unidad farmacia.unidad_medida not null,
    factor_base integer not null check (factor_base >= 1),
    es_unidad_base boolean not null default false,
    codigo_barras varchar(80) unique,
    precio_venta numeric(12,2) not null check (precio_venta >= 0),
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_producto_unidades_producto on farmacia.producto_unidades(producto_id);

alter table farmacia.detalles_venta add column if not exists producto_unidad_id uuid references farmacia.producto_unidades(id);
alter table farmacia.detalles_venta add column if not exists unidad_vendida farmacia.unidad_medida;
alter table farmacia.detalles_venta add column if not exists cantidad_base integer;

alter table farmacia.movimientos_inventario add column if not exists cantidad_base integer;
