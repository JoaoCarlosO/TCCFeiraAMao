-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para feiraamao
CREATE DATABASE IF NOT EXISTS `feiraamao` /*!40100 DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci */;
USE `feiraamao`;

-- Copiando estrutura para tabela feiraamao.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `IdCli` int(11) NOT NULL AUTO_INCREMENT,
  `NomeCli` varchar(150) NOT NULL,
  `Telefone` varchar(20) DEFAULT NULL,
  `datanasc` date NOT NULL,
  `LocalBusca` varchar(500) DEFAULT NULL,
  `Email` varchar(300) NOT NULL,
  `CPF` varchar(14) NOT NULL,
  `Senha` varchar(255) NOT NULL,
  PRIMARY KEY (`IdCli`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `CPF` (`CPF`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Copiando dados para a tabela feiraamao.clientes: ~0 rows (aproximadamente)
DELETE FROM `clientes`;

-- Copiando estrutura para tabela feiraamao.pagamento
CREATE TABLE IF NOT EXISTS `pagamento` (
  `IdPag` int(11) NOT NULL AUTO_INCREMENT,
  `IdPed` int(11) DEFAULT NULL,
  `Metodo` varchar(250) DEFAULT NULL,
  `Valor` float DEFAULT NULL,
  `StatusPag` varchar(250) DEFAULT NULL,
  `DataPag` date DEFAULT NULL,
  PRIMARY KEY (`IdPag`),
  KEY `IdPed` (`IdPed`),
  CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`IdPed`) REFERENCES `pedidos` (`IdPed`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Copiando dados para a tabela feiraamao.pagamento: ~0 rows (aproximadamente)
DELETE FROM `pagamento`;

-- Copiando estrutura para tabela feiraamao.pedidos
CREATE TABLE IF NOT EXISTS `pedidos` (
  `IdPed` int(11) NOT NULL AUTO_INCREMENT,
  `IdCli` int(11) DEFAULT NULL,
  `IdVend` int(11) DEFAULT NULL,
  `DataPed` date DEFAULT NULL,
  `StatusCli` varchar(200) DEFAULT NULL,
  `Subtotal` float DEFAULT NULL,
  PRIMARY KEY (`IdPed`),
  KEY `IdCli` (`IdCli`),
  KEY `IdVend` (`IdVend`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`IdCli`) REFERENCES `clientes` (`IdCli`) ON DELETE SET NULL,
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`IdVend`) REFERENCES `vendedor` (`IdVend`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Copiando dados para a tabela feiraamao.pedidos: ~0 rows (aproximadamente)
DELETE FROM `pedidos`;

-- Copiando estrutura para tabela feiraamao.produtos
CREATE TABLE IF NOT EXISTS `produtos` (
  `IdPro` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` varchar(255) NOT NULL,
  `Preco` decimal(10,2) DEFAULT NULL,
  `Quant` int(11) DEFAULT NULL,
  `Cat` varchar(260) DEFAULT NULL,
  `Estoque` int(11) DEFAULT NULL,
  `IdVend` int(11) DEFAULT NULL,
  `Imagem` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`IdPro`),
  KEY `IdVend` (`IdVend`),
  CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`IdVend`) REFERENCES `vendedor` (`IdVend`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Copiando dados para a tabela feiraamao.produtos: ~6 rows (aproximadamente)
DELETE FROM `produtos`;
INSERT INTO `produtos` (`IdPro`, `Nome`, `Preco`, `Quant`, `Cat`, `Estoque`, `IdVend`, `Imagem`) VALUES
	(1, '23', 23.00, 3, 'vszdeg', 3, NULL, ''),
	(2, 'df', 0.00, 3, 'fd', 3, NULL, ''),
	(3, 'as', 0.00, 0, 'ew', 0, NULL, ''),
	(4, 'm', 65.00, 4, 'p', 4, NULL, ''),
	(5, 'dr', 2.00, 34, 'rere', 34, NULL, ''),
	(6, 'sd', 54.00, 3, 'bdbew', 3, NULL, '');

-- Copiando estrutura para tabela feiraamao.vendedor
CREATE TABLE IF NOT EXISTS `vendedor` (
  `IdVend` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` varchar(150) NOT NULL,
  `Barraca` varchar(175) DEFAULT NULL,
  `Email` varchar(300) NOT NULL,
  `CPFCNPJ` varchar(20) NOT NULL,
  `Telefone` varchar(20) DEFAULT NULL,
  `Documento` varchar(500) DEFAULT NULL,
  `Senha` varchar(255) NOT NULL,
  PRIMARY KEY (`IdVend`),
  UNIQUE KEY `Email` (`Email`),
  UNIQUE KEY `CPFCNPJ` (`CPFCNPJ`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Copiando dados para a tabela feiraamao.vendedor: ~3 rows (aproximadamente)
DELETE FROM `vendedor`;
INSERT INTO `vendedor` (`IdVend`, `Nome`, `Barraca`, `Email`, `CPFCNPJ`, `Telefone`, `Documento`, `Senha`) VALUES
	(55, '3twwre', 'wewre', '3tw4wffq@gmail.com', 'eew', 'wewe', NULL, '$2y$10$gr/efRvUzoLU5Q0WcKZ7QOs/xk0tZApEBuqA3Z6GzBppFLaS8ndLm'),
	(59, 'sdv', 'ds', 'fantinnyrodriguec@gmail.com', 'sd34', 'sd', NULL, '$2y$10$PLuQddkColkZ3CeXYSsKD.HEomf.IZWK8MuSJPCCHlU2ty9iOfg2e'),
	(60, 'fs', 'ds', 'fantinnyrodguesc@gmail.com', '3463', '56454', NULL, '$2y$10$2YD7v2zRuSaNS6YyJlliv.muwOiY5iXKSGZU5DrLe4wRLkPJ4ORC2');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
