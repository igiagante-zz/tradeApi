
const expect = require('chai').expect;
const { connection } = require('../mongo/mongo_config');
const TradeNote = require('../../src/models/tradeNote');

describe('Trade Note Tests', () => {
    
    it('try to save a trade note', async () => {

        const images = [
            {
              _id: '57756a10dd10525d70000001',
              url: '/uploads/images/fullsize/chart/count_btc.png',
              thumbnailUrl: '/uploads/images/thumb/chart/count_btc.png',
              name: 'count_btc.png',
              mimetype: 'mime/png',
              size: 234567,
              main: true,
            },
            {
              _id: '57756a10dd10525d70000001',
              url: '/uploads/images/fullsize/chart/wedge_btc.png',
              thumbnailUrl: '/uploads/images/thumb/chart/wedge_btc.png',
              name: 'wedge_btc.png',
              mimetype: 'mime/png',
              size: 234567,
              main: false,
            },
          ]

        const newTradeNote = new TradeNote({
            title: 'test',
            description: 'test',
            images,
          });

        try {

            //connect to DB
            await connection();

            //create trade note
            const tradeNote = await newTradeNote.save();

            //search trade note
            const tradeNoteFound = await TradeNote.getById(tradeNote._id);

            //expect 
            expect(tradeNoteFound.toJSON()).to.deep.equal(tradeNote.toJSON());

            //clean DB
            await TradeNote.remove();

        } catch (error) {
            // then
            console.log(error);
            console.log(error.stack);
        }
    });

});