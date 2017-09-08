CREATE TABLE `itsaves`.`users` (
  `id_user` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `social_id` VARCHAR(45) NULL,
  `type` ENUM('facebook', 'google', 'linkedin', 'github') NULL,
  `created_at` DATE NULL,
  `updated_at` DATE NULL,
  PRIMARY KEY (`id_user`));


ALTER TABLE `itsaves`.`users` 
CHANGE COLUMN `created_at` `created_at` DATE NULL DEFAULT NOW() ,
CHANGE COLUMN `updated_at` `updated_at` DATE NULL DEFAULT NOW() ,
ADD UNIQUE INDEX `social_id_UNIQUE` (`social_id` ASC);
