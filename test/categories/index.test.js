'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../../bin/www');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../../config/serverConfig');
const {deleteDb} = require('../utils/cleandb');
const {createUserDB} = require('../utils/seeddata');
chai.should();

chai.use(chaiHttp);

describe('categories', () => {
  let token, user;
  before(() => {
    //start the server and connect to the db
    return runServer();
  });
  after(() => {
    //stop the server and disconnect from the db
    return closeServer();
  });
  beforeEach(() => {
    //create a user and then create a token
    return createUserDB('manager')
    .then(res => {
      user = res;
    })
    .then(() => {
      const {username} = user;
      token = jwt.sign(
        {username},
          JWT_SECRET,
          {algorithm: 'HS256', subject: 'username', expiresIn: '7d'}
      );
    });
  });
  //clean up and delete the db
  afterEach(() => {
    user = {};
    token = {};
    return deleteDb();
  });
  it('should create a category', () => {
    return chai.request(app)
    //request to /categories
    .post('/categories')
    //set headers
    .set('Accept', 'application/json')
    .set('authorization', `Bearer ${token}`)
    //send the following data
    .send({name: 'burgers'})
    .then(res => {
      res.should.have.status(201);
      /* eslint-disable */
      res.should.be.json;
      /* eslint-enable */
      res.body.should.include.keys('name');
      res.body.name.should.equal('burgers');
    });
  });
});
