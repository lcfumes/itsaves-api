const mongoose = require('mongoose');

const usersSchema = require('../config/users.schema.js');

const Model = mongoose.model('Users', usersSchema, 'users');

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

module.exports.findById = (id, callback) => {
  Model.findOne({
    _id: id,
  }, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.findByEmail = (email, callback) => {
  Model.findOne({
    email,
  }, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.findBySocialId = (socialId, callback) => {
  Model.findOne({
    socialId,
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
  this.findByEmail(payload.email, (err, doc) => {
    if (doc !== null) {
      callback(err, doc, false);
      return;
    }
    const user = new Model({
      name: payload.name,
      email: payload.email,
      socialId: payload.socialId,
      type: payload.type,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    user.save((errSave) => {
      if (!errSave) {
        this.findByEmail(payload.email, (errFindByEmail, document) => {
          callback(errFindByEmail, document, true);
        });
      }
    });
  });
};
module.exports.update = (request, callback) => {
  const query = {
    email: request.params.email,
  };
  const update = {
    $set: {
      name: request.payload.name,
      email: request.payload.email,
      socialId: request.payload.socialId,
      type: request.payload.type,
      updatedAt: new Date().getTime(),
    },
  };
  this.findByEmail(request.params.email, (err, doc) => {
    if (doc !== null) {
      Model.update(query, update, {
        multi: false,
      }, (errCallback) => {
        if (!errCallback) {
          this.findByEmail(request.params.email, (errFindByEmail, document) => {
            callback(errFindByEmail, document, true);
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

module.exports.deleteByEmail = (email, callback) => {
  this.findByEmail(email, (err, doc) => {
    if (doc === null) {
      callback(err, false);
      return;
    }
    Model.remove({
      email,
    }, (errRemove) => {
      callback(errRemove, true);
    });
  });
};

module.exports.deleteBySocialId = (socialId, callback) => {
  this.findBySocialId(socialId, (err, doc) => {
    if (doc === null) {
      callback(err, false);
      return;
    }
    Model.remove({
      socialId,
    }, (errRemove) => {
      callback(errRemove, true);
    });
  });
};
