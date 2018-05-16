
const expect = require('chai').expect;
const mongoose = require('mongoose');
const {initDB, cleanDB} = require('../mongo/mongo_config');
const userModel = require('../../src/models/user');

/**
 * root level hooks
 */
after((done) => {
    // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.connection.close();
    done();
  });

  
describe('User tests', () => {

    const testData = require('../resources/users.json');

    it('should find all users', function() {

        //const dataReady = await initDB(testData);
        //const users = await userModel.list();

        initDB(testData)
        .then((() => userModel.list()))
        .then((users) => {
            expect(users.length).to.equal(2);
            expect(users[0]._doc.firstname).to.equal('jose');
        });
      })
/*
    beforeEach((done) => { 
        initDB(testData)
        .then(() => {
            console.log(' initializing database ');
            done();
        });
    });

    afterEach(function (done) {

        const mongoUri = "mongodb://localhost/trade-test";

        const remove = () => {
            userModel.remove().exec()
            .then(() => {
                mongoose.connection.close();
                done();
            });
        }
    
        if (mongoose.connection.readyState === 0) {
            const connection = mongoose.connect(mongoUri, { useMongoClient: true });
            
            mongoose.connection.on('error', (error) => {
                throw new Error(`unable to connect to database: ${mongoUri}`);
            });
            remove();
        } else {
            remove();
        }
    });

    
    afterEach((done) => { 
        mongoose.connection.close();
        //cleanDB(testData);
        done();
    });*/

});