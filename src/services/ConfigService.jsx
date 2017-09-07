import _ from "lodash";

export default class ConfigService {

  constructor() {
    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.configFile = `${__dirname}/../config/config.${this.nodeEnv}.json`;
    this.config = {};
  }

  getEnv() {
    return this.nodeEnv;
  }

  getConfig() {
    if (_.size(this.config) === 0) {
      const config = require(this.configFile);
      this.config = config;
    }
    
    return this.config;
  }
}
