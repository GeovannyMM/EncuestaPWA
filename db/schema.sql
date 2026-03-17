-- Ejecutar este archivo en MySQL para crear la base de datos del proyecto
-- DBeaver: SQL Editor > pegar este contenido > Alt+X

CREATE DATABASE IF NOT EXISTS encuesta_alfabetismo;
USE encuesta_alfabetismo;

CREATE TABLE IF NOT EXISTS usuarios (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo  VARCHAR(255) NOT NULL,
  usuario_slug     VARCHAR(100) UNIQUE NOT NULL,
  activo           BOOLEAN DEFAULT TRUE,
  creado_en        DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS encuestas (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  folio             VARCHAR(50) UNIQUE NOT NULL,
  entrevistador_id  INT NOT NULL,
  nombre_encuestado VARCHAR(255) NOT NULL,
  nombre            VARCHAR(100),
  apellido_paterno  VARCHAR(100),
  apellido_materno  VARCHAR(100),
  edad              VARCHAR(10),
  fecha_hora        DATETIME NOT NULL,
  lat               DECIMAL(10,8),
  lng               DECIMAL(11,8),
  lugar             VARCHAR(255),
  p1 VARCHAR(5), p2 VARCHAR(5), p2cual VARCHAR(50),
  p3 VARCHAR(5), p3lengua VARCHAR(50),
  p4 VARCHAR(5), p4escrito TEXT,
  p5 TEXT, p6 VARCHAR(5), p6cuantos VARCHAR(20),
  estado_sinc       BOOLEAN DEFAULT FALSE,
  sincronizado_en   DATETIME,
  creado_en         DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (entrevistador_id) REFERENCES usuarios(id)
);
