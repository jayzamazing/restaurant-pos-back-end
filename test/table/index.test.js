'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../../bin/www');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../../config/serverConfig');
const {deleteDb} = require('../utils/cleandb');
const {createUserDB, createMenuDB, createTable, createTableDB} = require('../utils/seeddata');
chai.should();

chai.use(chaiHttp);

describe('create table', () => {
  let menu, table, token, user;
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
      /* eslint-disable */
      table = createTable(1, 103, [{dish: menu[0]._id, notes: 'swiss cheese'}]);
      /* eslint-enable */
    });
  });
  //clean up and delete the db
  afterEach(() => {
    menu = {};
    user = {};
    token = {};
    return deleteDb();
  });
  it('should create a table', () => {
    return chai.request(app)
    //request to /categories
    .post('/tables')
    //set headers
    .set('Accept', 'application/json')
    .set('authorization', `Bearer ${token}`)
    //send the following data
    .send(table)
    .then(res => {
      res.should.have.status(201);
      /* eslint-disable */
      res.should.be.json;
      /* eslint-enable */
      res.body.should.include.keys('_id', 'tableId', 'checkNumber', 'order');
      res.body.tableId.should.equal(table.tableId);
      res.body.order.should.be.an('array');
      res.body.order[0].notes.should.equal(table.order[0].notes);
      res.body.order[0].dish.should.equal(table.order[0].dish.toString());
    });
  });
});
describe('get a table', () => {
  let menu, tables, token, user;
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
      return createTableDB(menu);
    })
    .then(res => {
      tables = res;
      return tables;
    });
  });
  //clean up and delete the db
  afterEach(() => {
    menu = {};
    user = {};
    token = {};
    tables = {};
    return deleteDb();
  });
  it('should get a table', () => {
    return chai.request(app)
    //request to /categories
    .get('/tables')
    //set headers
    .set('Accept', 'application/json')
    .set('authorization', `Bearer ${token}`)
    .then(res => {
      res.should.have.status(200);
      /* eslint-disable */
      res.should.be.json;
      /* eslint-enable */
      res.body[0].should.include.keys('_id', 'tableId', 'checkNumber', 'order');
      res.body[0].tableId.should.equal(tables[0].tableId);
      res.body[0].order.should.be.an('array');
      res.body[0].order[0].notes.should.equal(tables[0].order[0].notes);
      res.body[0].order[0].dish.should.equal(tables[0].order[0].dish.toString());
    });
  });
});
