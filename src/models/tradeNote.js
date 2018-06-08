const mongoose = require('mongoose');

const Schema = mongoose.Schema; // eslint-disable-line
const genericModel = require('./generic_model');

const TradeNoteSchema = new Schema({ // eslint-disable-line
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [
    {
      _id: Schema.Types.ObjectId,
      url: { type: String, required: true },
      thumbnailUrl: { type: String, required: true },
      name: { type: String, required: true },
      mimetype: { type: String, required: true },
      size: Number,
      main: { type: Boolean, default: false },
    },
  ],
});

TradeNoteSchema.plugin(genericModel);

module.exports = mongoose.model('TradeNote', TradeNoteSchema);
