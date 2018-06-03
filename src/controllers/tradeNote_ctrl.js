

const TradeNote = require('../models/tradeNote');
// const APIError = require('../helpers/APIError');
// const httpStatus = require('http-status');

const debug = require('debug')('tradeApi:TradeNoteController');

const imageService = require('../services/image_service');

const createTradeNote = function (req, res, next) { // eslint-disable-line
  if (!req.body.title || !req.body.description) {
    return res.json({ success: false, msg: ' Tittle & description needed' });
  }

  // it should be created a context with user data.
  // Peter is the folder name to save images
  return imageService.convertImageFilesToImageModel('peter', req.files)
    .then(images => new TradeNote({
      title: req.body.title,
      description: req.body.description,
      images,
    }).save())
    .then((tradeNote) => {
      const note = tradeNote.toJSON();
      debug(`Trade Note created successfully. \n ${JSON.stringify(note)} \n\n `);
      return res.json(note);
    });
};

module.exports = Object.assign({}, { createTradeNote });
