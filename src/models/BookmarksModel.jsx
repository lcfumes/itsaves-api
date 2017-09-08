import _ from "lodash";

export default class BookmarksModel {

  constructor(connection) {
    this.connection = connection;

    this.table = 'bookmarks';

    this.id_user = "";
  }

  setIdUser(idUser) {
    this.id_user = idUser;
  }

  insert(bookmark, callbackFn) {
    this.findByUrl(bookmark.url, (error, results, fields) => {
      if (error) {
        return callbackFn(error);
      }

      if (_.size(results) > 0) {
        return callbackFn(false, false);
      }

      this.connection.query(`
        INSERT INTO ${this.table}  (fk_user, url, title, description, created_at, updated_at)
        VALUES ("${this.id_user}", "${bookmark.url}", "${bookmark.title}", "${bookmark.description}", NOW(), NOW())`, 
        (error, results, fields) => {
          this.findByUrl(bookmark.url, (error, results, fields) => {
            if (error) {
              return callbackFn(error, [], false);
            }
            return callbackFn(false, results, true);
          }
        );
      });
    });
  }

  findAll(callbackFn) {
    if (this.id_user === "" || this.id_user === undefined) {
      return callbackFn(`ID User not setted`);
    }

    this.connection.query(`
      SELECT id_bookmark, fk_user as id_user, url, title, description, created_at, updated_at FROM ${this.table} WHERE fk_user="${this.id_user}"`,
      (error, results, fields) => {
        callbackFn(error, results, fields);
      }
    );
  }

  findByUrl(url, callbackFn) {
    if (this.id_user === "" || this.id_user === undefined) {
      return callbackFn(`ID User not setted`);
    }
    if (url === "") {
      return callbackFn(`URL not informed`);
    }
    this.connection.query(`
      SELECT id_bookmark, fk_user as id_user, url, title, description, created_at, updated_at FROM ${this.table} WHERE fk_user="${this.id_user}" AND url="${url}"`,
      (error, results, fields) => {
        callbackFn(error, results, fields);
      }
    );
  }

  findById(idBookmark, callbackFn) {
    if (this.id_user === "" || this.id_user === undefined) {
      return callbackFn(`ID User not setted`);
    }
    if (idBookmark === "") {
      return callbackFn(`URL not informed`);
    }
    this.connection.query(`
      SELECT id_bookmark, fk_user as id_user, url, title, description, created_at, updated_at FROM ${this.table} WHERE fk_user="${this.id_user}" AND id_bookmark="${idBookmark}"`,
      (error, results, fields) => {
        callbackFn(error, results, fields);
      }
    );
  }

  deleteById(idBookmark, callbackFn) {
    if (this.id_user === "" || this.id_user === undefined) {
      return callbackFn(`ID User not setted`);
    }
    if (idBookmark === "") {
      return callbackFn(`URL not informed`);
    }
    this.connection.query(`
      DELETE FROM ${this.table} WHERE fk_user="${this.id_user}" AND id_bookmark="${idBookmark}"`,
      (error, results, fields) => {
        if (error) {
          return callbackFn(error, false);
        }
        if (results.affectedRows > 0) {
          return callbackFn(false, true);
        }
        return callbackFn(false, false);
      }
    );
  }

}