'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../../bin/www');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../../config/serverConfig');
const {deleteDb} = require('../utils/cleandb');
const {createUserDB, createMenu, createMenuDB, createCategoriesDB} = require('../utils/seeddata');
chai.should();

chai.use(chaiHttp);

describe('create menu', () => {
  let menu, token, user;
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
    })
    /* eslint-disable */
    .then(() => createCategoriesDB(1))
    /* eslint-enable */
    .then(res => {
      menu = createMenu(res[0]._id);
    });
  });
  //clean up and delete the db
  afterEach(() => {
    menu = {};
    user = {};
    token = {};
    return deleteDb();
  });
  it('should create a menu', () => {
    return chai.request(app)
    //request to /menu
    .post('/menus')
    //set headers
    .set('Accept', 'application/json')
    .set('authorization', `Bearer ${token}`)
    //send the following data
    .send(menu)
    .then(res => {
      res.should.have.status(201);
      /* eslint-disable */
      res.should.be.json;
      /* eslint-enable */
      res.body.should.include.keys('name');
      res.body.name.should.equal(menu.name);
    });
  });
});
describe('get menu', () => {
  let menu, token, user;
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
    })
    /* eslint-disable */
    .then(() => createMenuDB(5))
    /* eslint-enable */
    .then(res => {
      menu = res;
    });
  });
  //clean up and delete the db
  afterEach(() => {
    menu = {};
    user = {};
    token = {};
    return deleteDb();
  });
  it('should get menu', () => {
    return chai.request(app)
    //request to /menu
    .get('/menus')
    //set headers
    .set('Accept', 'application/json')
    .set('authorization', `Bearer ${token}`)
    .then(res => {
      res.should.have.status(200);
      /* eslint-disable */
      res.should.be.json;
      /* eslint-enable */
      res.body[0].should.include.keys('name');
      res.body[0].name.should.equal(menu[0].name);
    });
  });
});
