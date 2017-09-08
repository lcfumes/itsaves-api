CREATE TABLE `itsaves`.`bookmarks` (
  `id_bookmark` INT NOT NULL AUTO_INCREMENT,
  `fk_user` VARCHAR(45) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `title` VARCHAR(100) NULL,
  `description` VARCHAR(255) NULL,
  `created_at` DATE NOT NULL DEFAULT NOW(),
  `updated_at` DATE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id_bookmark`));
