const bookmarkSchema = require('../config/bookmark.schema.js');

/* global database */
const Model = database.Model('Bookmarks', bookmarkSchema, 'bookmark');

module.exports.totalDocs = (callback) => {
  Model.count({}, (err, count) => {
    callback(err, count);
  });
};

module.exports.findAll = (page, limit, callback) => {
  Model.find({})
    .skip((parseInt(page, 10) * parseInt(limit, 10)))
    .limit(parseInt(limit, 10))
    .sort({
      created_at: 'desc',
    })
    .exec((err, doc) => {
      callback(doc);
    });
};

module.exports.findByUrl = (url, callback) => {
  Model.findOne({
    url,
  }, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.findByFields = (object, callback) => {
  Model.findOne(object, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.create = (payload, ip, callback) => {
  this.findByUrl(payload.url, (err, doc) => {
    if (doc !== null) {
      callback(err, doc, false);
      return;
    }
    const bookmark = new Model({
      url: payload.url,
      title: payload.title,
      description: payload.description,
      created_at: new Date().getTime(),
      updated_at: new Date().getTime(),
    });

    bookmark.save((errSave) => {
      if (!errSave) {
        this.findByUrl(payload.url, (errFindByUrl, document) => {
          callback(errFindByUrl, document, true);
        });
      }
    });
  });
};
module.exports.update = (request, ip, callback) => {
  const query = {
    url: request.params.url,
  };
  const update = {
    $set: {
      url: request.payload.url,
      title: request.payload.title,
      description: request.payload.description,
      updated_at: new Date().getTime(),
    },
  };
  this.findByUrl(request.params.url, (err, doc) => {
    if (doc !== null) {
      Model.update(query, update, {
        multi: false,
      }, (errCallback) => {
        if (!errCallback) {
          this.findByUrl(request.params.url, (errFindByUrl, document) => {
            callback(errFindByUrl, document, true);
          });
        } else {
          callback(errCallback, [], false);
        }
      });
    } else {
      callback(null, [], false);
    }
  });
};

module.exports.deleteByUrl = (url, callback) => {
  this.findByUrl(url, (err, doc) => {
    if (doc === null) {
      callback(err, false);
      return;
    }
    Model.remove({
      url,
    }, (errRemove) => {
      callback(errRemove, true);
    });
  });
};
