const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = {
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  name: String,
  description: String,
  createdAt: Date,
  updatedAt: Date,
};
