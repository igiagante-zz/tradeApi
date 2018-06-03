

const express = require('express');
const userCtrl = require('../controllers/tradeNote_ctrl');

const router = express.Router(); // eslint-disable-line new-cap

const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/addTradeNote', upload.array('images'), userCtrl.createTradeNote);

router.get('/addTradeNote', (req, res) =>
  res.send('it ok!'));

module.exports = router;
