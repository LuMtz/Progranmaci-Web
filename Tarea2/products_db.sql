-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS products_db;

-- 2. Seleccionar la base de datos para usarla
USE products_db;

-- 3. Crear la tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    description TEXT NOT NULL,
    brand VARCHAR(100) DEFAULT NULL,
    img VARCHAR(255) DEFAULT NULL,
    active BOOLEAN DEFAULT TRUE
);