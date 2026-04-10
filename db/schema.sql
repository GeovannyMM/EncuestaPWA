-- Ejecutar este archivo en MySQL para crear la base de datos del proyecto
-- DBeaver: SQL Editor > pegar este contenido > Alt+X

CREATE DATABASE IF NOT EXISTS encuesta_alfabetismo;
USE encuesta_alfabetismo;

CREATE TABLE IF NOT EXISTS usuarios (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo  VARCHAR(255),
  usuario_slug     VARCHAR(100) UNIQUE NOT NULL,
  activo           BOOLEAN DEFAULT TRUE,
  creado_en        DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS encuestas (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  folio             VARCHAR(50) UNIQUE NOT NULL,
  encuestador_id  INT NOT NULL,
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
  p4 VARCHAR(5),  p4_folio VARCHAR(255),
  p5_folio VARCHAR(255), p6 VARCHAR(5), p6cuantos VARCHAR(20),
  estado_sinc BOOLEAN DEFAULT FALSE,
  sincronizado_en   DATETIME,
  creado_en         DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (encuestador_id) REFERENCES usuarios(id)
);


----------------------------------------------------------------------
USE encuesta_alfabetismo;

ALTER TABLE usuarios MODIFY nombre_completo VARCHAR(255) NULL;

INSERT INTO usuarios (id, nombre_completo, usuario_slug) VALUES 
(1, 'Juan Pérez', 'juanP'),
(2, 'María López', 'mariaL'),
(3, 'Carlos Ruiz', 'carlosR');



-------------------------------------------------------------

ALTER TABLE encuestas ADD COLUMN sexo VARCHAR(10) AFTER edad;

---------------------------------------------------------------

ALTER TABLE encuestas CHANGE p4escrito p4_folio VARCHAR(100);

------------------------------------------------------------------------------------

ALTER TABLE encuestas CHANGE COLUMN entrevistador_id encuestador_id INT NOT NULL;
