-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema pm_manager
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pm_manager
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pm_manager` ;
USE `pm_manager` ;

-- -----------------------------------------------------
-- Table `pm_manager`.`Admin`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pm_manager`.`Admin` ;

CREATE TABLE IF NOT EXISTS `pm_manager`.`Admin` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cpf` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(45) NOT NULL,
  `dados_json` VARCHAR(400) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pm_manager`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pm_manager`.`User` ;

CREATE TABLE IF NOT EXISTS `pm_manager`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `admin_id` INT NOT NULL,
  `cpf` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(45) NOT NULL,
  `dados_json` VARCHAR(400) NULL,
  PRIMARY KEY (`id`, `admin_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE,
  INDEX `fk_admin_idx` (`admin_id` ASC) VISIBLE,
  CONSTRAINT `fk_admin_user`
    FOREIGN KEY (`admin_id`)
    REFERENCES `pm_manager`.`Admin` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pm_manager`.`Login`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pm_manager`.`Login` ;

CREATE TABLE IF NOT EXISTS `pm_manager`.`Login` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `admin_id` INT NULL,
  `user_id` INT NULL,
  `uuid` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID())),
  `data_inicio` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC) VISIBLE,
  INDEX `fk_admin_idx` (`admin_id` ASC) VISIBLE,
  INDEX `fk_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_admin_login`
    FOREIGN KEY (`admin_id`)
    REFERENCES `pm_manager`.`Admin` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_login`
    FOREIGN KEY (`user_id`)
    REFERENCES `pm_manager`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pm_manager`.`Folga`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pm_manager`.`Folga` ;

CREATE TABLE IF NOT EXISTS `pm_manager`.`Folga` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `data_folga` DATE NULL,
  `uuid` BINARY(16) NOT NULL DEFAULT (UUID_TO_BIN(UUID())),
  `data_criacao` DATETIME NOT NULL DEFAULT NOW(),
  `dados_json` VARCHAR(400) NULL,
  PRIMARY KEY (`id`, `user_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_user_idx` (`user_id` ASC) VISIBLE,
  UNIQUE INDEX `uuid_UNIQUE` (`uuid` ASC) VISIBLE,
  CONSTRAINT `fk_user_folga`
    FOREIGN KEY (`user_id`)
    REFERENCES `pm_manager`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `pm_manager` ;

-- -----------------------------------------------------
-- procedure CREATE_ADMIN
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`CREATE_ADMIN`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `CREATE_ADMIN` (cpf VARCHAR(45), senha VARCHAR(45))
BEGIN
	-- Localiza Admin
	DECLARE adminId INT;
	SELECT id INTO adminId
		FROM Admin AS a
		WHERE a.cpf = cpf
        LIMIT 1;
	-- Checa Admin
	IF adminId IS NULL THEN
		INSERT INTO Admin (cpf, senha) VALUES (cpf, senha);
		SELECT "ok" AS "response"; -- Ok
	ELSE
		SELECT "already_exists" AS "response"; -- Admin já existe
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure LOGIN_ADMIN
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`LOGIN_ADMIN`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `LOGIN_ADMIN` (cpf VARCHAR(45), senha VARCHAR(45))
BEGIN
	-- Localiza Admin
	DECLARE adminId INT;
	SELECT id INTO adminId
		FROM Admin AS a
		WHERE a.cpf = cpf AND a.senha = senha
        LIMIT 1;
	-- Checa Admin
	IF NOT adminId IS NULL THEN
		-- Login Admin
		INSERT INTO Login (admin_id) VALUES (adminId);
		SELECT BIN_TO_UUID(uuid) AS "uuid"
			FROM Login AS l
            WHERE l.admin_id = adminId
			ORDER BY l.data_inicio DESC
			LIMIT 1; -- UUID do novo Login
	ELSE
		SELECT "not_found" AS "response"; -- Admin não existe
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure LOGOUT_ADMIN
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`LOGOUT_ADMIN`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `LOGOUT_ADMIN` (loginUUID VARCHAR(36))
BEGIN
	-- Localiza Login
	DECLARE loginId INT;
	SELECT id INTO loginId
		FROM Login AS l WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
    -- Checa Login
	IF NOT loginId IS NULL THEN
		-- Deleta Login
		DELETE FROM Login AS l WHERE l.id = loginId;
		SELECT "ok" AS "response"; -- Ok
	ELSE
		SELECT "not_found" AS "response"; -- Login não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure DELETE_ADMIN
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`DELETE_ADMIN`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `DELETE_ADMIN` (loginUUID VARCHAR(36))
BEGIN
	-- Localiza Admin
	DECLARE adminId INT;
	SELECT a.id INTO adminId
		FROM Admin AS a
		INNER JOIN Login AS l ON l.admin_id = a.id
        WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
    -- Checa Admin
	IF NOT adminId IS NULL THEN
		-- Deleta Admin
		DELETE FROM Login WHERE admin_id = adminId;
		DELETE FROM Admin WHERE id = adminId;
		SELECT "ok" AS "response"; -- Ok
	ELSE
		SELECT "not_found" AS "response"; -- Admin não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure CREATE_USER
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`CREATE_USER`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `CREATE_USER` (cpf VARCHAR(45), senha VARCHAR(45), loginUUID VARCHAR(36))
BEGIN
	DECLARE adminId INT;
	DECLARE userId INT;
	-- Localiza Admin
	SELECT a.id INTO adminId
		FROM Admin AS a
		INNER JOIN Login AS l ON l.admin_id = a.id
        WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
	-- Localiza User
	SELECT id INTO userId
		FROM User AS u
		WHERE u.cpf = cpf
        LIMIT 1;
	-- Checa Admin
	IF NOT adminId IS NULL THEN
		-- Checa User
		IF userId IS NULL THEN
			INSERT INTO User (admin_id, cpf, senha) VALUES (adminId, cpf, senha);
			SELECT "ok" AS "response"; -- Ok
		ELSE
			SELECT "already_exists" AS "response"; -- User já existe
		END IF;
	ELSE
		SELECT "not_found" AS "response"; -- Admin não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure LOGIN_USER
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`LOGIN_USER`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `LOGIN_USER` (cpf VARCHAR(45), senha VARCHAR(45))
BEGIN
	-- Localiza User
	DECLARE userId INT;
	SELECT id INTO userId
		FROM User AS u
		WHERE u.cpf = cpf AND u.senha = senha
        LIMIT 1;
	-- Checa User
	IF NOT userId IS NULL THEN
		-- Login User
		INSERT INTO Login (user_id) VALUES (userId);
		SELECT BIN_TO_UUID(uuid) AS "uuid"
			FROM Login AS l
            WHERE l.user_id = userId
			ORDER BY l.data_inicio DESC
			LIMIT 1; -- UUID do novo Login
	ELSE
		SELECT "not_found" AS "response"; -- User não existe
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure LOGOUT_USER
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`LOGOUT_USER`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `LOGOUT_USER` (loginUUID VARCHAR(36))
BEGIN
	-- Localiza Login
	DECLARE loginId INT;
	SELECT id INTO loginId
		FROM Login AS l WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
    -- Checa Login
	IF NOT loginId IS NULL THEN
		-- Deleta Login
		DELETE FROM Login AS l WHERE l.id = loginId;
		SELECT "ok" AS "response"; -- Ok
	ELSE
		SELECT "not_found" AS "response"; -- Login não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure UPDATE_USER
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`UPDATE_USER`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `UPDATE_USER` (cpf VARCHAR(45), dadosJSON VARCHAR(400), loginUUID VARCHAR(36))
BEGIN
	DECLARE adminId INT;
	DECLARE userId INT;
	-- Localiza Admin
	SELECT a.id INTO adminId
		FROM Admin AS a
		INNER JOIN Login AS l ON l.admin_id = a.id
        WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
	-- Localiza User
	SELECT id INTO userId
		FROM User AS u
		WHERE u.cpf = cpf
        LIMIT 1;
	-- Checa Admin
	IF NOT adminId IS NULL THEN
		-- Checa User
		IF NOT userId IS NULL THEN
			UPDATE User SET dados_json = dadosJSON WHERE cpf = cpf;
			SELECT "ok" AS "response"; -- Ok
		ELSE
			SELECT "not_found" AS "response"; -- User não encontrado
		END IF;
	ELSE
		SELECT "not_found" AS "response"; -- Admin não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure DELETE_USER
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`DELETE_USER`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `DELETE_USER` (cpf VARCHAR(45), loginUUID VARCHAR(36))
BEGIN
	DECLARE adminId INT;
	DECLARE userId INT;
	-- Localiza Admin
	SELECT a.id INTO adminId
		FROM Admin AS a
		INNER JOIN Login AS l ON l.admin_id = a.id
        WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
	-- Localiza User
	SELECT id INTO userId
		FROM User AS u
		WHERE u.cpf = cpf
        LIMIT 1;
	-- Checa Admin
	IF NOT adminId IS NULL THEN
		-- Checa User
		IF NOT userId IS NULL THEN
			-- Deleta User
			DELETE FROM Login WHERE user_id = userId;
			DELETE FROM User WHERE id = userId;
			SELECT "ok" AS "response"; -- Ok
		ELSE
			SELECT "not_found" AS "response"; -- User não encontrado
		END IF;
	ELSE
		SELECT "not_found" AS "response"; -- Admin não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure LIST_USERS
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`LIST_USERS`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `LIST_USERS` (loginUUID VARCHAR(36))
BEGIN
	DECLARE adminId INT;
	-- Localiza Admin
	SELECT a.id INTO adminId
		FROM Admin AS a
		INNER JOIN Login AS l ON l.admin_id = a.id
        WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
	-- Checa Admin
	IF NOT adminId IS NULL THEN
		SELECT
			cpf AS "cpf",
            dados_json AS "dados"
            FROM User WHERE admin_id = adminId; -- Lista de User
	ELSE
		SELECT "not_found" AS "response"; -- Admin não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure LIST_FOLGAS
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`LIST_FOLGAS`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `LIST_FOLGAS` (mes DATE, loginUUID VARCHAR(36))
BEGIN
	DECLARE adminId INT;
	-- Localiza Admin
	SELECT a.id INTO adminId
		FROM Admin AS a
		INNER JOIN Login AS l ON l.admin_id = a.id
        WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
	-- Checa Admin
	IF NOT adminId IS NULL THEN
		SELECT 
			BIN_TO_UUID(uuid) AS "uuid",
			data_folga AS "data",
            dados_json AS "dados"
            FROM Folga WHERE
				MONTH(mes) = MONTH(data_folga)
                AND YEAR(mes) = YEAR(data_folga)
                OR data_folga IS NULL; -- Lista de Folga por mês
	ELSE
		SELECT "not_found" AS "response"; -- Admin não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure CREATE_FOLGA
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`CREATE_FOLGA`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `CREATE_FOLGA` (cpf VARCHAR(45), loginUUID VARCHAR(36))
BEGIN
	DECLARE adminId INT;
	DECLARE userId INT;
	-- Localiza Admin
	SELECT a.id INTO adminId
		FROM Admin AS a
		INNER JOIN Login AS l ON l.admin_id = a.id
        WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
	-- Localiza User
	SELECT id INTO userId
		FROM User AS u
		WHERE u.cpf = cpf
        LIMIT 1;
	-- Checa Admin
	IF NOT adminId IS NULL THEN
		-- Checa User
		IF NOT userId IS NULL THEN
			INSERT INTO Folga (user_id) VALUES (userId);
			SELECT BIN_TO_UUID(uuid) AS "uuid"
				FROM Folga AS f
				WHERE f.user_id = userId
				ORDER BY f.data_criacao DESC
				LIMIT 1; -- UUID da nova Folga
		ELSE
			SELECT "not_found" AS "response"; -- User não encontrado
		END IF;
	ELSE
		SELECT "not_found" AS "response"; -- Admin não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure UPDATE_FOLGA
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`UPDATE_FOLGA`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `UPDATE_FOLGA` (uuid VARCHAR(36), dadosJSON VARCHAR(400), loginUUID VARCHAR(36))
BEGIN
	DECLARE adminId INT;
	DECLARE folgaId INT;
	-- Localiza Admin
	SELECT a.id INTO adminId
		FROM Admin AS a
		INNER JOIN Login AS l ON l.admin_id = a.id
        WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
	-- Localiza Folga
	SELECT f.id INTO folgaId
		FROM Folga AS f
        WHERE BIN_TO_UUID(f.uuid) = uuid
        LIMIT 1;
	-- Checa Admin
	IF NOT adminId IS NULL THEN
		-- Checa Folga
		IF NOT folgaId IS NULL THEN
			UPDATE Folga SET dados_json = dadosJSON WHERE id = folgaId;
			SELECT "ok" AS "response"; -- Ok
		ELSE
			SELECT "not_found" AS "response"; -- Folga não encontrada
		END IF;
	ELSE
		SELECT "not_found" AS "response"; -- Admin não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure UPDATE_FOLGA_DATA
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`UPDATE_FOLGA_DATA`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `UPDATE_FOLGA_DATA` (uuid VARCHAR(36), dataFolga DATE, loginUUID VARCHAR(36))
BEGIN
	DECLARE adminId INT;
	DECLARE folgaId INT;
	-- Localiza Admin
	SELECT a.id INTO adminId
		FROM Admin AS a
		INNER JOIN Login AS l ON l.admin_id = a.id
        WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
	-- Localiza Folga
	SELECT f.id INTO folgaId
		FROM Folga AS f
        WHERE BIN_TO_UUID(f.uuid) = uuid
        LIMIT 1;
	-- Checa Admin
	IF NOT adminId IS NULL THEN
		-- Checa Folga
		IF NOT folgaId IS NULL THEN
			UPDATE Folga SET data_folga = dataFolga WHERE id = folgaId;
			SELECT "ok" AS "response"; -- Ok
		ELSE
			SELECT "not_found" AS "response"; -- Folga não encontrada
		END IF;
	ELSE
		SELECT "not_found" AS "response"; -- Admin não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure GET_FOLGA
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`GET_FOLGA`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `GET_FOLGA` (uuid VARCHAR(36), loginUUID VARCHAR(36))
BEGIN
	DECLARE adminId INT;
	DECLARE folgaId INT;
	-- Localiza Admin
	SELECT a.id INTO adminId
		FROM Admin AS a
		INNER JOIN Login AS l ON l.admin_id = a.id
        WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
	-- Localiza Folga
	SELECT f.id INTO folgaId
		FROM Folga AS f
        WHERE BIN_TO_UUID(f.uuid) = uuid
        LIMIT 1;
	-- Checa Admin
	IF NOT adminId IS NULL THEN
		-- Checa Folga
		IF NOT folgaId IS NULL THEN
			SELECT
				BIN_TO_UUID(f.uuid) AS "uuid",
				f.data_folga AS "data",
				f.dados_json AS "dados"
				FROM Folga AS f WHERE f.id = folgaId; -- Folga
		ELSE
			SELECT "not_found" AS "response"; -- Folga não encontrada
		END IF;
	ELSE
		SELECT "not_found" AS "response"; -- Admin não encontrado
	END IF;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure DELETE_FOLGA
-- -----------------------------------------------------

USE `pm_manager`;
DROP procedure IF EXISTS `pm_manager`.`DELETE_FOLGA`;

DELIMITER $$
USE `pm_manager`$$
CREATE PROCEDURE `DELETE_FOLGA` (uuid VARCHAR(36), loginUUID VARCHAR(36))
BEGIN
	DECLARE adminId INT;
	DECLARE folgaId INT;
	-- Localiza Admin
	SELECT a.id INTO adminId
		FROM Admin AS a
		INNER JOIN Login AS l ON l.admin_id = a.id
        WHERE BIN_TO_UUID(l.uuid) = loginUUID
        LIMIT 1;
	-- Localiza Folga
	SELECT f.id INTO folgaId
		FROM Folga AS f
        WHERE BIN_TO_UUID(f.uuid) = uuid
        LIMIT 1;
	-- Checa Admin
	IF NOT adminId IS NULL THEN
		-- Checa Folga
		IF NOT folgaId IS NULL THEN
			DELETE FROM Folga WHERE id = folgaId;
			SELECT "ok" AS "response"; -- Ok
		ELSE
			SELECT "not_found" AS "response"; -- Folga não encontrada
		END IF;
	ELSE
		SELECT "not_found" AS "response"; -- Admin não encontrado
	END IF;
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
