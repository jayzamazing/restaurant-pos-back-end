'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../../bin/www');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../../config/serverConfig');
const {deleteDb} = require('../utils/cleandb');
const {createUserDB, createCategory, createCategoriesDB} = require('../utils/seeddata');
chai.should();

chai.use(chaiHttp);

describe('create categories', () => {
  let category, token, user;
  before(() => {
    //start the server and connect to the db
    return runServer();
  });
  after(() => {
    //stop the server and disconnect from the db
    return closeServer();
  });
  beforeEach(() => {
    category = createCategory();
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
    .send(category)
    .then(res => {
      res.should.have.status(201);
      /* eslint-disable */
      res.should.be.json;
      /* eslint-enable */
      res.body.should.include.keys('name');
      res.body.name.should.equal(category.name);
    });
  });
});
describe('get categories', () => {
  let categories, token, user;
  before(() => {
    //start the server and connect to the db
    return runServer();
  });
  after(() => {
    //stop the server and disconnect from the db
    return closeServer();
  });
  beforeEach(() => {
    /* eslint-disable */
    return createCategoriesDB(5)
    /* eslint-enable */
    .then(res => {
      categories = res;
    })
    .then(() => createUserDB('manager'))
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
    categories = {};
    user = {};
    token = {};
    return deleteDb();
  });
  it('should get categories', () => {
    return chai.request(app)
    //request to /categories
    .get('/categories')
    //set headers
    .set('Accept', 'application/json')
    .set('authorization', `Bearer ${token}`)
    .then(res => {
      res.should.have.status(200);
      /* eslint-disable */
      res.should.be.json;
      /* eslint-enable */
      res.body[0].should.include.keys('name');
      res.body[0].name.should.equal(categories[0].name);
    });
  });
});
