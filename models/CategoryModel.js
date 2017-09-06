const mongoose = require('mongoose');

const categorySchema = require('../config/categories.schema.js');

const Model = mongoose.model('Caegories', categorySchema, 'categories');

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

module.exports.findByName = (name, callback) => {
  Model.findOne({
    name,
  }, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.findByNameAndUserId = (userId, name, callback) => {
  Model.findOne({
    name,
    userId,
  }, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.findByUserAndId = (userId, categoryId, callback) => {
  Model.findOne({
    _id: mongoose.Types.ObjectId(categoryId),
    userId: mongoose.Types.ObjectId(userId),
  }, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.findById = (categoryId, callback) => {
  Model.findOne({
    _id: mongoose.Types.ObjectId(categoryId),
  }, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.findByFields = (object, callback) => {
  Model.findOne(object, (err, doc) => {
    callback(err, doc);
  });
};

module.exports.create = (userId, payload, callback) => {
  this.findByNameAndUserId(userId, payload.name, (err, doc) => {
    if (doc !== null) {
      callback(err, doc, false);
      return;
    }
    const categories = new Model({
      userId: payload.userId,
      name: payload.name,
      description: payload.description,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    categories.save((errSave) => {
      if (!errSave) {
        callback(false, categories, true);
      }
    });
  });
};
