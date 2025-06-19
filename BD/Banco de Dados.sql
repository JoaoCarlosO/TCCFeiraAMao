-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.1.33-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win32
-- HeidiSQL Versão:              9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Copiando estrutura do banco de dados para feiraamao
CREATE DATABASE IF NOT EXISTS `feiraamao` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `feiraamao`;

-- Copiando estrutura para tabela feiraamao.avaliacoes
CREATE TABLE IF NOT EXISTS `avaliacoes` (
  `IdAva` int(11) NOT NULL,
  `IdCli` int(11) DEFAULT NULL,
  `IdVend` int(11) DEFAULT NULL,
  `IdPro` int(11) DEFAULT NULL,
  `Notas` varchar(20) DEFAULT NULL,
  `Comentario` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`IdAva`),
  KEY `IdCli` (`IdCli`),
  KEY `IdVend` (`IdVend`),
  KEY `IdPro` (`IdPro`),
  CONSTRAINT `avaliacoes_ibfk_1` FOREIGN KEY (`IdCli`) REFERENCES `clientes` (`IdCli`),
  CONSTRAINT `avaliacoes_ibfk_2` FOREIGN KEY (`IdVend`) REFERENCES `vendedor` (`IdVend`),
  CONSTRAINT `avaliacoes_ibfk_3` FOREIGN KEY (`IdPro`) REFERENCES `produtos` (`IdPro`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Exportação de dados foi desmarcado.
-- Copiando estrutura para tabela feiraamao.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `IdCli` int(11) NOT NULL,
  `NomeCli` varchar(150) DEFAULT NULL,
  `Telefone` varchar(20) DEFAULT NULL,
  `LocalBusca` varchar(500) DEFAULT NULL,
  `Email` varchar(300) DEFAULT NULL,
  `CPF` varchar(14) DEFAULT NULL,
  PRIMARY KEY (`IdCli`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Exportação de dados foi desmarcado.
-- Copiando estrutura para tabela feiraamao.pagamento
CREATE TABLE IF NOT EXISTS `pagamento` (
  `IdPag` int(11) NOT NULL,
  `IdPed` int(11) DEFAULT NULL,
  `Metodo` varchar(250) DEFAULT NULL,
  `Valor` float DEFAULT NULL,
  `StatusPag` varchar(250) DEFAULT NULL,
  `DataPag` date DEFAULT NULL,
  PRIMARY KEY (`IdPag`),
  KEY `IdPed` (`IdPed`),
  CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`IdPed`) REFERENCES `pedidos` (`IdPed`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Exportação de dados foi desmarcado.
-- Copiando estrutura para tabela feiraamao.pedidos
CREATE TABLE IF NOT EXISTS `pedidos` (
  `IdPed` int(11) NOT NULL,
  `IdCli` int(11) DEFAULT NULL,
  `DataPed` date DEFAULT NULL,
  `StatusCli` varchar(200) DEFAULT NULL,
  `Subtotal` float DEFAULT NULL,
  PRIMARY KEY (`IdPed`),
  KEY `IdCli` (`IdCli`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`IdCli`) REFERENCES `clientes` (`IdCli`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Exportação de dados foi desmarcado.
-- Copiando estrutura para tabela feiraamao.produtos
CREATE TABLE IF NOT EXISTS `produtos` (
  `IdPro` int(11) NOT NULL,
  `Preco` float DEFAULT NULL,
  `Quant` int(11) DEFAULT NULL,
  `Cat` varchar(260) DEFAULT NULL,
  `Estoque` int(11) DEFAULT NULL,
  `IdVend` int(11) DEFAULT NULL,
  PRIMARY KEY (`IdPro`),
  KEY `IdVend` (`IdVend`),
  CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`IdVend`) REFERENCES `vendedor` (`IdVend`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Exportação de dados foi desmarcado.
-- Copiando estrutura para tabela feiraamao.vendedor
CREATE TABLE IF NOT EXISTS `vendedor` (
  `IdVend` int(11) NOT NULL,
  `NomeVend` varchar(150) DEFAULT NULL,
  `NomeBanca` varchar(175) DEFAULT NULL,
  `Descri` varchar(200) DEFAULT NULL,
  `Rua` varchar(200) DEFAULT NULL,
  `Bairro` varchar(200) DEFAULT NULL,
  `Cidade` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`IdVend`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Exportação de dados foi desmarcado.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
