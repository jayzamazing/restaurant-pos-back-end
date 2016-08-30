'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../../../src/app');
var Table = app.service('tables');
var User = app.service('users');
var authentication = require('feathers-authentication/client');
const bodyParser = require('body-parser');
var token;
//config for app to do authentication
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .configure(authentication());
//use http plugin
chai.use(chaiHttp);
//use should
var should = chai.should();
/*
 * All tests that should be run
 */
describe('table service', function() {
  before((done) => {
    //start the server
    this.server = app.listen(3030);
    //once listening do the following
    this.server.once('listening', () => {
      //create mock user
      User.create({
        'username': 'resposadmin',
        'password': 'igzSwi7*Creif4V$',
        'roles': ['admin']
      }, () => {
        //setup a request to get authentication token
        chai.request(app)
          //request to /auth/local
          .post('/auth/local')
          //set header
          .set('Accept', 'application/json')
          //send credentials
          .send({
            'username': 'resposadmin',
            'password': 'igzSwi7*Creif4V$'
          })
          //when finished
          .end((err, res) => {
            //set token for auth in other requests
            token = res.body.token;
            done();
          });
      });
    });
  });
  //setup
  beforeEach((done) => {
    //go through mongoose and create some mock items for testing
    Table.create([
      {
      tableId: 1,
      checkNumber: 1,
      order: [{
        dish: 'omlette',
        notes: 'cheddar, bacon only',
        cost: 4.99
      }, {
        dish: 'coffee',
        notes: '',
        cost: 1.99
      }]
    },
    {
      tableId: 2,
      checkNumber: 1,
      order: [{
        dish: 'reuben',
        notes: 'provolone, side of coleslaw',
        cost: 7.99
      }, {
        dish: 'soda',
        notes: '',
        cost: 1.99
      }]
    },
    {
      tableId: 3,
      checkNumber: 1,
      order: [{
        dish: 'chicken sandwhich',
        notes: 'munster, easy on mayo',
        cost: 7.99
      }, {
        dish: 'tea',
        notes: '',
        cost: 1.99
      }]
    },
    {
      tableId: 3,
      checkNumber: 2,
      order: [{
        dish: 'fish n chips',
        notes: 'to-go',
        cost: 8.99
      }]
    }
  ], done);
  });
  //teardown after tests
  after((done) => {
    User.remove(null, () => {
      //stop the server
      this.server.close(function() {});
      done();
    });
  });
  afterEach((done) => {
    //delete contents of menu in mongodb
    Table.remove(null, () => {
      done();
    });
  });
  it('registered the tables service', () => {
    assert.ok(app.service('tables'));
  });
  //test for get /table
  it('should get the table data', function(done) {
    //setup a request
    chai.request(app)
      //request to /
      .get('/tables')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
      .send({
        query: {
          $sort: {
            _id: 1
          }
        }
      })
      //when finished do the following
      .end(function(err, res) {
        //check server gives 201 response and the data sent back from the server
        res.should.have.status(200);
        res.body.data[0].tableId.should.be.a('number');
        res.body.data[0].tableId.should.equal(1);
        res.body.data[0].checkNumber.should.be.a('number');
        res.body.data[0].checkNumber.should.equal(1);
        res.body.data[0].order.should.be.a('array');
        res.body.data[0].order[0].dish.should.be.a('string');
        res.body.data[0].order[0].dish.should.equal('omlette');
        res.body.data[0].order[0].notes.should.be.a('string');
        res.body.data[0].order[0].notes.should.equal('cheddar, bacon only');
        res.body.data[0].order[0].cost.should.be.a('number');
        res.body.data[0].order[0].cost.should.equal(4.99);
        res.body.data[0].order[1].dish.should.be.a('string');
        res.body.data[0].order[1].dish.should.equal('coffee');
        res.body.data[0].order[1].notes.should.be.a('string');
        res.body.data[0].order[1].notes.should.equal('');
        res.body.data[0].order[1].cost.should.be.a('number');
        res.body.data[0].order[1].cost.should.equal(1.99);
        done();
      });
  });
  //test for post for /guest to add order data to a table and specific check
  it('should post the guest order data', function(done) {
    //setup a request
    chai.request(app)
      //post to /order
      .post('/tables')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
      //attach data to request
      .send({
        tableId: 3,
        checkNumber: 2,
        order: [{
          dish: 'cheeseburger',
          notes: 'swiss cheese',
          cost: 8.99
        }]
      })
      //when done do the following
      .end(function(err, res) {
        //check server gives 201 response
        res.should.have.status(201);
        res.body.tableId.should.be.a('number');
        res.body.tableId.should.equal(3);
        res.body.checkNumber.should.be.a('number');
        res.body.checkNumber.should.equal(2);
        res.body.order.should.be.a('array');
        res.body.order[0].dish.should.be.a('string');
        res.body.order[0].dish.should.equal('cheeseburger');
        res.body.order[0].notes.should.be.a('string');
        res.body.order[0].notes.should.equal('swiss cheese');
        res.body.order[0].cost.should.be.a('number');
        res.body.order[0].cost.should.equal(8.99);
        done();
      });
  });
  //test for put for /tables
  it('should update the guest data', function(done) {
    chai.request(app)
      //request to /tables
      .get('/tables')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
      .send({
        query: {
          $sort: {
            _id: 1
          }
        }
      })
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /tables
          .put('/tables/' + res.body.data[1]._id)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '.concat(token))
          //attach data to request
          .send({
            tableId: 2,
            checkNumber: 1,
            order: [{
              dish: 'reuben',
              notes: 'provolone, side of coleslaw',
              cost: 7.99
            }, {
              dish: 'soda',
              notes: '',
              cost: 1.99
            }, {
              dish: 'fries',
              notes: '',
              cost: 2.99
            }]
          })
          //when finished do the following
          .end(function(err, res) {
            //check server gives 200 response
            res.should.have.status(200);
            res.body.order[2].dish.should.be.a('string');
            res.body.order[2].dish.should.equal('fries');
            res.body.order[2].notes.should.be.a('string');
            res.body.order[2].notes.should.equal('');
            res.body.order[2].cost.should.be.a('number');
            res.body.order[2].cost.should.equal(2.99);
            done();
          });
      });
  });
});
