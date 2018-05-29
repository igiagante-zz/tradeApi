const mongoose = require('mongoose');

const Schema = mongoose.Schema; // eslint-disable-line
const genericModel = require('./generic_model');

const ImageSchema = new Schema({
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: Number,
  main: { type: Boolean, default: false },
});

ImageSchema.plugin(genericModel);
