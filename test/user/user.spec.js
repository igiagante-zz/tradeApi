
const expect = require('chai').expect;
const mongoose = require('mongoose');
const {initDB, cleanDB} = require('../mongo/mongo_config');
const userModel = require('../../src/models/user');

describe('User tests', () => {

    const testData = require('../resources/users.json');
    beforeEach(() => initDB(testData));
    //afterEach(() => cleanDB(testData));

    it('should find all users', (done) => {
        return userModel.list()
          .then(users => {
            expect(users.length).to.equal(2)
            expect(users[0]._doc.firstname).to.equal('jose')
          })
      })
});