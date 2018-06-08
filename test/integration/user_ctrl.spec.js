const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const jwt = require('jwt-simple');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const app = require('../../src/index');
const settings = require('../../src/config/settings');

chai.config.includeStack = true;

// Configure mongo db and insert some documents
const { connection, cleanDB } = require('../mongo/mongo_config');

const UserModel = require('../../src/models/user');
const testData = require('../resources/user/users.json');

//after(() => cleanDB(testData));

describe('## Auth APIs', () => {

beforeEach(() => cleanDB(testData));
//afterEach(() => cleanDB(testData));

  describe('# POST /api/users/signup', () => {

    const user = {
        firstname: "pepe",
        lastname: "almendra",
        email: "pepe@gmail.com",
        password: "pepe"
    };

    it('should return a valid jwt token', (done) => {
      request(app)
        .post('/api/users/signup')
        .send(user)
        .expect(httpStatus.OK)
        .then((res) => {
            expect(res.body).to.have.property('token');
            const payload = jwt.decode(res.body.token, settings.jwtSecret);
            expect(payload).to.have.property('exp');
            expect(payload).to.have.property('iat');
            expect(payload).to.have.property('sub');
            done();
          })
        .catch(done);
    });

  });

  describe('# POST /api/users/login', () => {

    const validUserCredentials = {
        email: "pepe@gmail.com",
        password: "pepe"
    };

    it('should return a jwt token after user logged in', (done) => {

        connection()
                .then(() => {
                    const newUser = new UserModel({
                        firstname: "pepe",
                        lastname: "almendra",
                        email: "pepe@gmail.com",
                        password: "pepe"
                    });
                    return newUser.save();
                })
                .then((user) => {
                    request(app)
                    .post('/api/users/login')
                    .send(validUserCredentials)
                    .expect(httpStatus.OK)
                    .then((res) => {
                        expect(res.body).to.have.property('token');
                        done();
                    })
                    .catch(done);
            });
        })
    });
});