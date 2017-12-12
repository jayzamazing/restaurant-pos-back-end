'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../../bin/www');
const {DATABASE_URL} = require('../../config/serverConfig');
const {createStoreDb} = require('../utils/seeddata');
chai.should();

chai.use(chaiHttp);

function deleteDb() {
  return mongoose.connection.db.dropDatabase();
}
function createUser() {
  return createStoreDb()
  .then(res => {
    return {
      username: faker.internet.userName(),
      password: faker.internet.password(),
      store: res._id
    };
  });
}
describe('user service', () => {
  //setup
  before(() => {
    return runServer(DATABASE_URL);
  });
  after(() => {
    return closeServer();
  });
  afterEach(() => {
    return deleteDb();
  });
  it('should create a user', () => {
    createUser()
    .then(user => {
      chai.request(app)
        //request to /cards
        .post('/users')
        //set headers
        .set('Accept', 'application/json')
        //send the following data
        .send(user)
        .then(res => {
          res.should.have.status(201);
          /* eslint-disable */
          res.should.be.json;
          /* eslint-enable */
          res.body.should.include.keys('username', 'createdAt', 'updatedAt');
          res.body.username.should.equal(user.username);
        });
    });

  });
});
