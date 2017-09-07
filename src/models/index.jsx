import fs from 'fs';
import path from 'path';
import ConfigService from '../services/ConfigService';
import mysql from 'mysql';

const basename = path.basename(module.filename);
const objConfig = new ConfigService();

const config = objConfig.getConfig();
const connection = mysql.createConnection(config.database);
const db = {};

fs
  .readdirSync(__dirname)
  .filter((file) => 
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-4) === '.jsx'))
  .forEach((file) => {
    const modelName = file.slice(0, -4);
    const model = require(`./${modelName}`).default;
    db[modelName] = new model(connection);
  });

module.exports = db;