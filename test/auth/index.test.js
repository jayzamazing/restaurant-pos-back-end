'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {deleteDb} = require('../utils/cleandb');
const {app, runServer, closeServer} = require('../../bin/www');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../../config/serverConfig');
const {createUserDB} = require('../utils/seeddata');
chai.should();

chai.use(chaiHttp);

describe('auth service', () => {
  let decoded, token, user;
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
      decoded = jwt.decode(token);
    });
  });
  //clean up and delete the db
  afterEach(() => {
    user = {};
    token = {};
    decoded = {};
    return deleteDb();
  });
  it('should not allow user to login', () => {
    return chai.request(app)
      .post('/login')
      .catch(err => {
        err.status.should.equal(404);
      });
  });
  it('should allow user to login', () => {
    return chai.request(app)
      .post('/auth/login')
      //set headers
      .set('Accept', 'application/json')
      //send the following data
      .auth(user.username, user.unhashed)
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        const resToken = res.body.authToken;
        resToken.should.be.a('string');
        const payload = jwt.verify(resToken, JWT_SECRET, {algorithm: ['HS256']});
        payload.user.username.should.equal(user.username);
      });
  });
  it('should allow user to refresh their token', () => {
    return chai.request(app)
      .post('/auth/refresh')
      //set headers
      .set('authorization', `Bearer ${token}`)
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        const resToken = res.body.authToken;
        resToken.should.be.a('string');
        const payload = jwt.verify(resToken, JWT_SECRET, {algorithm: ['HS256']});
        payload.user.username.should.eql(user.username);
        payload.exp.should.be.at.least(decoded.exp);
      });
  });
});
