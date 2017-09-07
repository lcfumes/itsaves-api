CREATE TABLE `itsaves`.`users` (
  `id_user` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `social_id` VARCHAR(45) NULL,
  `type` ENUM('facebook', 'google', 'linkedin', 'github') NULL,
  `created_at` DATE NULL,
  `updated_at` DATE NULL,
  PRIMARY KEY (`id_user`));
