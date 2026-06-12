-- Eliminar tablas si existen (orden inverso por FK)
DROP TABLE IF EXISTS transacciones;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

-- Tipo ENUM para transacciones
DO $$ BEGIN
  CREATE TYPE tipo_transaccion AS ENUM ('ingreso', 'gasto');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  apellido      VARCHAR(100),
  email         VARCHAR(150) UNIQUE NOT NULL,
  password      VARCHAR(200) NOT NULL,
  "createdAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla categorias
CREATE TABLE IF NOT EXISTS categorias (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  "createdAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id            SERIAL PRIMARY KEY,
  monto         NUMERIC(12,2) NOT NULL,
  fecha         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  descripcion   TEXT,
  tipo          tipo_transaccion NOT NULL,
  usuario_id    INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  categoria_id  INT REFERENCES categorias(id) ON DELETE SET NULL,
  "createdAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
