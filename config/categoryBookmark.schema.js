const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = {
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
};
