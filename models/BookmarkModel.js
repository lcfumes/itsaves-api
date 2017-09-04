const mongoose = require('mongoose');

const bookmarksSchema = require('../config/bookmarks.schema.js');

const Model = mongoose.model('Bookmarks', bookmarksSchema, 'bookmarks');

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
      createdAt: 'desc',
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

module.exports.findByUserAndId = (userId, bookmarkId, callback) => {
  Model.findOne({
    _id: mongoose.Types.ObjectId(bookmarkId),
    userId: mongoose.Types.ObjectId(userId),
  }, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.findById = (bookmarkId, callback) => {
  Model.findOne({
    _id: mongoose.Types.ObjectId(bookmarkId),
  }, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.findByFields = (object, callback) => {
  Model.findOne(object, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.create = (payload, callback) => {
  this.findByUrl(payload.url, (err, doc) => {
    if (doc !== null) {
      callback(err, doc, false);
      return;
    }
    const bookmark = new Model({
      userId: payload.userId,
      url: payload.url,
      title: payload.title,
      description: payload.description,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
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
module.exports.update = (request, callback) => {
  const query = {
    url: request.params.url,
  };
  const update = {
    $set: {
      url: request.payload.url,
      title: request.payload.title,
      description: request.payload.description,
      updatedAt: new Date().getTime(),
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

module.exports.deleteByUserAndId = (userId, bookmarkId, callback) => {
  this.findByUserAndId(userId, bookmarkId, (err, doc) => {
    if (doc === null || err) {
      callback(err, false);
      return;
    }
    Model.remove({
      _id: mongoose.Types.ObjectId(bookmarkId),
      userId: mongoose.Types.ObjectId(userId),
    }, (errRemove) => {
      callback(errRemove, true);
    });
  });
};

module.exports.deleteById = (bookmarkId, callback) => {
  this.findById(bookmarkId, (err, doc) => {
    if (doc === null || err) {
      callback(err, false);
      return;
    }
    Model.remove({
      _id: mongoose.Types.ObjectId(bookmarkId),
    }, (errRemove) => {
      callback(errRemove, true);
    });
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
