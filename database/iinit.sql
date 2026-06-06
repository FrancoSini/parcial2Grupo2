-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL,
  monto NUMERIC(10,2) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  descripcion TEXT
);

-- Inserts de prueba
INSERT INTO usuarios (nombre, email, password)
VALUES 
  ('Ricardo', 'ricardo@mail.com', '1234'),
  ('Ana', 'ana@mail.com', 'abcd'),
  ('Luis', 'luis@mail.com', 'pass');

INSERT INTO categorias (nombre, descripcion)
VALUES
  ('Alimentos', 'Gastos de comida y supermercado'),
  ('Transporte', 'Colectivo, taxi, combustible'),
  ('Entretenimiento', 'Cine, música, salidas');

INSERT INTO transacciones (usuario_id, categoria_id, monto, descripcion)
VALUES
  (1, 1, 2500.00, 'Compra en la cooperativa obrera'),
  (2, 2, 800.00, 'Viaje en taxi'),
  (3, 3, 1500.00, 'Entrada al cine');