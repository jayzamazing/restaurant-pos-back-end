'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../../bin/www');
const {DATABASE_URL} = require('../../config/serverConfig');
const {createStoreDb, createUser} = require('../utils/seeddata');
const {deleteDb} = require('../utils/cleandb');
chai.should();

chai.use(chaiHttp);

describe('user service', () => {
  let user;
  //setup
  before(() => {
    //run the server
    return runServer(DATABASE_URL);
  });
  after(() => {
    //close the server
    return closeServer();
  });
  beforeEach(() => {
    //create a store
    return createStoreDb()
    //create a user passing in the store id and roles
    .then(res => createUser(res._id, 'manager'))
    //take the results and store it
    .then(res => {
      user = res;
    });
  });
  afterEach(() => {
    //delete the db
    return deleteDb();
  });
  it('should create a user', () => {
    return chai.request(app)
      //request to /users
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
      res.body.should.include.keys('username');
      res.body.username.should.equal(user.username);
    });
  });
});
