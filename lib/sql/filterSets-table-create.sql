CREATE DATABASE cfdemo;

USE cfdemo;

CREATE TABLE `employees` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fname` varchar(45) NOT NULL COMMENT 'The first name of the employee',
  `lname` varchar(45) NOT NULL COMMENT 'The last name of the employee',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `hired` date DEFAULT NULL COMMENT 'The date employee was hired',
  `supervisor` varchar(45) DEFAULT NULL COMMENT 'The supervisor name of the employee',
  `notes` text DEFAULT NULL COMMENT 'Extra information for the employee',
  PRIMARY KEY (`id`),
  UNIQUE KEY `fname-lname_UNIQUE` (`fname`,`lname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `filterSets` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `category` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `table` varchar(45) NOT NULL,
  `filters_json` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_tableFilters_employees_idx` (`user_id`),
  CONSTRAINT `fk_tableFilters_employees` FOREIGN KEY (`user_id`) 
      REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO `employees` (`fname`,`lname`,`status`,`hired`) VALUES
('Tyler', 'Durden', 1, DATE('1976-9-30')),
('Ploobie', 'McSniggles', 1, DATE('1978-4-18'));