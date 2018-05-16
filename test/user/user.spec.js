
const expect = require('chai').expect;
const mongoose = require('mongoose');
const { initDB, cleanDB } = require('../mongo/mongo_config');
const UserModel = require('../../src/models/user');

const testData = require('../resources/users.json');

after(() => cleanDB(testData));
  
describe('User tests', () => {

    beforeEach(() => initDB(testData));
    afterEach(() => cleanDB(testData));
    
    it('should failed trying to save an user that already exists', async () => {

        const user = new UserModel ({
            firstname: "pepe",
            lastname: "almendra",
            email: "pepe@gmaill.com",
            password: "pepe"
        });

        try {
            const users = await user.save(user);
        } catch (error) {
            // then
            expect(error.name).to.equal('MongoError');
            expect(error.code).to.equal(11000);
        }
    });

    it('should transform _id from Mongo to id', async () => {

        const user = await UserModel.getByKeyAndValue('firstname', 'jose');

        expect(user).to.have.property('id');
        expect(user.id).equal(user._id);

    });

    it('should find all users', async () => {

        const users = await UserModel.list();

        expect(users.length).to.equal(2);
        expect(users[0]._doc.firstname).to.equal('pepe');

    });

    it('should find an user by name', async () => {

        const user = await UserModel.getByKeyAndValue('firstname', 'jose');
        expect(user.email).to.equal('jose@gmail.com');

    });

});