-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-02-2026 a las 04:42:27
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;
--
-- Base de datos: `sistema_condominio`
--
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `casas`
--
CREATE TABLE `casas` (
    `numero_casa` varchar(20) NOT NULL COMMENT 'Ej: A-52, PB-01',
    `propietario_cedula` varchar(20) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `cuotas_mensuales`
--
CREATE TABLE `cuotas_mensuales` (
    `id` int(11) NOT NULL,
    `mes` int(2) NOT NULL COMMENT '1=Ene, 2=Feb...',
    `anio` int(4) NOT NULL COMMENT 'Ej: 2026',
    `monto_deuda` decimal(10, 2) NOT NULL COMMENT 'Monto base del condominio',
    `descripcion` varchar(100) DEFAULT 'Cuota de Condominio'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `gastos`
--
CREATE TABLE `gastos` (
    `id` int(11) NOT NULL,
    `fecha` date NOT NULL,
    `beneficiario` varchar(100) NOT NULL DEFAULT 'Agencia de Condominio',
    `concepto` varchar(200) NOT NULL COMMENT 'Ej: Honorarios Administrativos',
    `monto_bs` decimal(12, 2) DEFAULT 0.00,
    `monto_usd` decimal(10, 2) DEFAULT 0.00,
    `nro_factura_proveedor` varchar(50) DEFAULT NULL COMMENT 'El número de recibo que entrega la Agencia',
    `forma_pago` varchar(50) NOT NULL COMMENT 'Transferencia, Efectivo'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `periodos_pagados`
--
CREATE TABLE `periodos_pagados` (
    `id` int(11) NOT NULL,
    `recibo_nro` int(11) NOT NULL,
    `mes` int(2) NOT NULL COMMENT 'Mes que se está cancelando',
    `anio` int(4) NOT NULL COMMENT 'Año que se está cancelando',
    `monto_asignado` decimal(10, 2) DEFAULT NULL COMMENT 'Porción del dinero dedicada a este mes'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `propietarios`
--
CREATE TABLE `propietarios` (
    `cedula` varchar(20) NOT NULL COMMENT 'Cédula o RIF, ej: V-12345678',
    `nombre_completo` varchar(100) NOT NULL,
    `telefono` varchar(20) DEFAULT NULL,
    `email` varchar(100) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `recibos`
--
CREATE TABLE `recibos` (
    `nro_recibo` int(11) NOT NULL COMMENT 'Número impreso en el papel o consecutivo manual',
    `casa_numero` varchar(20) NOT NULL,
    `fecha` date NOT NULL,
    `monto_bs` decimal(12, 2) DEFAULT 0.00,
    `monto_usd` decimal(10, 2) DEFAULT 0.00,
    `tasa_cambio` decimal(10, 2) DEFAULT NULL COMMENT 'Opcional: Tasa del día para auditoría',
    `referencia` varchar(50) DEFAULT NULL COMMENT 'Ref Bancaria (Vacío si es efectivo)',
    `metodo_pago` varchar(50) NOT NULL COMMENT 'Pago Móvil, Zelle, Efectivo',
    `observaciones` text DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;
--
-- Índices para tablas volcadas
--
--
-- Indices de la tabla `casas`
--
ALTER TABLE `casas`
ADD PRIMARY KEY (`numero_casa`),
    ADD KEY `fk_casa_propietario` (`propietario_cedula`);
--
-- Indices de la tabla `cuotas_mensuales`
--
ALTER TABLE `cuotas_mensuales`
ADD PRIMARY KEY (`id`),
    ADD UNIQUE KEY `unico_mes_anio` (`mes`, `anio`);
--
-- Indices de la tabla `gastos`
--
ALTER TABLE `gastos`
ADD PRIMARY KEY (`id`);
--
-- Indices de la tabla `periodos_pagados`
--
ALTER TABLE `periodos_pagados`
ADD PRIMARY KEY (`id`),
    ADD KEY `fk_detalle_recibo` (`recibo_nro`);
--
-- Indices de la tabla `propietarios`
--
ALTER TABLE `propietarios`
ADD PRIMARY KEY (`cedula`);
--
-- Indices de la tabla `recibos`
--
ALTER TABLE `recibos`
ADD PRIMARY KEY (`nro_recibo`),
    ADD KEY `fk_recibo_casa` (`casa_numero`);
--
-- AUTO_INCREMENT de las tablas volcadas
--
--
-- AUTO_INCREMENT de la tabla `cuotas_mensuales`
--
ALTER TABLE `cuotas_mensuales`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `gastos`
--
ALTER TABLE `gastos`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `periodos_pagados`
--
ALTER TABLE `periodos_pagados`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Restricciones para tablas volcadas
--
--
-- Filtros para la tabla `casas`
--
ALTER TABLE `casas`
ADD CONSTRAINT `fk_casa_propietario` FOREIGN KEY (`propietario_cedula`) REFERENCES `propietarios` (`cedula`) ON UPDATE CASCADE;
--
-- Filtros para la tabla `periodos_pagados`
--
ALTER TABLE `periodos_pagados`
ADD CONSTRAINT `fk_detalle_recibo` FOREIGN KEY (`recibo_nro`) REFERENCES `recibos` (`nro_recibo`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Filtros para la tabla `recibos`
--
ALTER TABLE `recibos`
ADD CONSTRAINT `fk_recibo_casa` FOREIGN KEY (`casa_numero`) REFERENCES `casas` (`numero_casa`) ON UPDATE CASCADE;
COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;