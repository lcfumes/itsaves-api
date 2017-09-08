import _ from "lodash";

export default class UsersModel {

  constructor(connection) {
    this.connection = connection;

    this.table = 'users';

    this.id_user = '';
    this.name = '';
    this.email = '';
    this.social_id = '';
    this.type = '';
    this.created_at = '';
    this.updated_at = '';
  }

  setter(field, value) {
    this[field] = value;
  }

  get() {
    return {
      id_user: this.id_user,
      name: this.name,
      email: this.email,
      social_id: this.social_id,
      type: this.type,
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }

  populate(results) {
    if (_.size(results[0]) === 0) {
      return;
    }

    this.setter('id_user', results[0].id_user);
    this.setter('name', results[0].name);
    this.setter('email', results[0].email);
    this.setter('social_id', results[0].social_id);
    this.setter('type', results[0].type);
    this.setter('created_at', results[0].created_at);
    this.setter('updated_at', results[0].updated_at);
  }

  insert(callbackFn) {
    this.findBySocialId((error, results, fields) => {
      if (error) {
        return callbackFn(error);
      }

      if (_.size(results) > 0) {
        return callbackFn(false, false);
      }

      this.connection.query(`
        INSERT INTO ${this.table}  (name, email, social_id, type, created_at, updated_at)
        VALUES ("${this.name}", "${this.email}", "${this.social_id}", "${this.type}", NOW(), NOW())`, 
        (error, results, fields) => {
          this.findBySocialId((error, results, fields) => {
            if (!error) {
              this.populate(results);
            }
            callbackFn(error, true);
          }
        );
      });
    });
  }

  findBySocialId(callbackFn) {
    this.connection.query(`
      SELECT id_user, name, email, social_id, type, created_at, updated_at FROM users WHERE social_id="${this.social_id}"`, 
      (error, results, fields) => {
        if (!error) {
          this.populate(results);
        }        
        callbackFn(error, results, fields);
      }
    );
  }

}