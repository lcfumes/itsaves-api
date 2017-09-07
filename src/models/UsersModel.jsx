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

  insert(callbackFn) {
    this.connection.connect();

    this.connection.query(`
      INSERT INTO 
        ${this.table} 
          (name, email, social_id, type, created_at, updated_at)
        VALUES
          ("${this.name}",
           "${this.email}",
           "${this.social_id}",
           "${this.type}",
           NOW(),
           NOW()
          )`, 
      (error, results, fields) => {
        let insertId = 0;
        if (!error) {
          insertId = results.insertId;
        }
        this.connection.end();
        callbackFn(error, insertId);
      });
  }

}