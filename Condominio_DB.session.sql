-- =========================================================
-- 1. SECCIÓN DE LIMPIEZA (RESET)
-- Borra las tablas si existen para empezar desde cero y evitar errores.
-- =========================================================
DROP TABLE IF EXISTS detalles_pago CASCADE;
DROP TABLE IF EXISTS recibos CASCADE;
DROP TABLE IF EXISTS metodos_pago CASCADE;
DROP TABLE IF EXISTS casas CASCADE;
DROP TABLE IF EXISTS propietarios CASCADE;
-- =========================================================
-- 2. CREACIÓN DE TABLAS (ESTRUCTURA)
-- =========================================================
-- Tabla 1: PROPIETARIOS
-- Almacena los nombres de los dueños.
CREATE TABLE propietarios (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL
);
-- Tabla 2: CASAS (UNIDADES)
-- Vincula cada casa con su dueño.
CREATE TABLE casas (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(20) NOT NULL,
    -- Ej: "A-52"
    propietario_id INTEGER NOT NULL,
    CONSTRAINT fk_propietario FOREIGN KEY(propietario_id) REFERENCES propietarios(id) ON DELETE RESTRICT
);
-- Tabla 3: MÉTODOS DE PAGO
-- Catálogo para evitar errores de escritura (Pago Móvil, Zelle, etc.)
CREATE TABLE metodos_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);
-- Tabla 4: RECIBOS (Cabecera)
-- La información principal de tu hoja de papel.
CREATE TABLE recibos (
    id SERIAL PRIMARY KEY,
    casa_id INTEGER NOT NULL,
    metodo_id INTEGER NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Montos (DECIMAL es el estándar para dinero)
    monto_bs DECIMAL(16, 2) DEFAULT 0.00,
    monto_usd DECIMAL(10, 2) DEFAULT 0.00,
    referencia VARCHAR(50),
    CONSTRAINT fk_casa FOREIGN KEY(casa_id) REFERENCES casas(id),
    CONSTRAINT fk_metodo FOREIGN KEY(metodo_id) REFERENCES metodos_pago(id)
);
-- Tabla 5: DETALLES DE PAGO
-- Aquí se guardan los "Meses Cancelados" (uno por fila).
CREATE TABLE detalles_pago (
    id SERIAL PRIMARY KEY,
    recibo_id INTEGER NOT NULL,
    mes_cancelado VARCHAR(50) NOT NULL,
    -- Ej: "Enero"
    CONSTRAINT fk_recibo FOREIGN KEY(recibo_id) REFERENCES recibos(id) ON DELETE CASCADE
);
-- =========================================================
-- 3. DATOS DE PRUEBA (OPCIONAL)
-- Ejecuta esto para ver que todo funciona y no salga la pantalla vacía.
-- =========================================================
-- Creamos un dueño y una casa
INSERT INTO propietarios (nombre_completo)
VALUES ('Juan Perez');
INSERT INTO casas (numero, propietario_id)
VALUES ('A-01', 1);
-- Creamos los métodos de pago
INSERT INTO metodos_pago (nombre)
VALUES ('Pago Movil'),
    ('Zelle'),
    ('Efectivo');
-- Creamos un recibo de prueba
INSERT INTO recibos (casa_id, metodo_id, fecha, monto_bs, referencia)
VALUES (1, 1, '2026-02-01', 150.00, 'REF123456');
-- Verificamos que se guardó
SELECT *
FROM recibos;