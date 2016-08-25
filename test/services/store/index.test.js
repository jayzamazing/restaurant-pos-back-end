'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../../../src/app');
var Store = app.service('stores');
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
describe('store service', () => {
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
      Store.create({
        storeNumber: 1,
        storeName: 'FOod r Us1',
        address: '313 somewhere',
        city: 'nowehere',
        state: 'fl',
        zipCode: '33412',
        stateTax: 6.5,
        recommendedTip: 20
      });
      Store.create({
        storeNumber: 2,
        storeName: 'FOod r Us2',
        address: '219 everywhere ln',
        city: 'compton',
        state: 'ca',
        zipCode: '93213',
        stateTax: 12,
        recommendedTip: 18
      });
      Store.create({
        storeNumber: 3,
        storeName: 'FOod r Us3',
        address: '2312 hotdog ln',
        city: 'whoknows',
        state: 'ga',
        zipCode: '24232',
        stateTax: 5,
        recommendedTip: 15
      });
      Store.create({
        storeNumber: 4,
        storeName: 'FOod r Us4',
        address: '234 rodeo pk',
        city: 'bfe',
        state: 'tx',
        zipCode: '45324',
        stateTax: 4,
        recommendedTip: 12
      }, done);
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
    Store.remove(null, () => {
      done();
      });
  });
  it('registered the stores service', () => {
    assert.ok(app.service('stores'));
  });
  //test for get /store
  it('should get the store data', function(done) {
    //setup a request
    chai.request(app)
      //request to /
      .get('/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
      .send({
        query: {
          $sort: { _id: 1 }
        }
      })
      //when finished do the following
      .end(function(err, res) {
        //check server gives 201 response and the data sent back from the server
        res.should.have.status(200);
        res.body.data[0].storeNumber.should.be.a('number');
        res.body.data[0].storeNumber.should.equal(1);
        res.body.data[0].storeName.should.be.a('string');
        res.body.data[0].storeName.should.equal('FOod r Us1');
        res.body.data[0].address.should.be.a('string');
        res.body.data[0].address.should.equal('313 somewhere');
        res.body.data[0].city.should.be.a('string');
        res.body.data[0].city.should.equal('nowehere');
        res.body.data[0].state.should.be.a('string');
        res.body.data[0].state.should.equal('fl');
        res.body.data[0].zipCode.should.be.a('string');
        res.body.data[0].zipCode.should.equal('33412');
        res.body.data[0].stateTax.should.be.a('number');
        res.body.data[0].stateTax.should.equal(6.5);
        res.body.data[0].recommendedTip.should.be.a('number');
        res.body.data[0].recommendedTip.should.equal(20);
        done();
      });
  });
  //test for post for /store
  it('should post the store data', function(done) {
    //setup a request
    chai.request(app)
      //request to /store
      .post('/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
      //attach data to request
      .send({
        storeNumber: 5,
        storeName: 'FOod r Us5',
        address: '324 drive rd',
        city: 'kablah',
        state: 'om',
        zipCode: '23423',
        stateTax: 6,
        recommendedTip: 13
      })
      //when finished do the following
      .end(function(err, res) {
        res.body.storeNumber.should.be.a('number');
        res.body.storeNumber.should.equal(5);
        res.body.storeName.should.be.a('string');
        res.body.storeName.should.equal('FOod r Us5');
        res.body.address.should.be.a('string');
        res.body.address.should.equal('324 drive rd');
        res.body.city.should.be.a('string');
        res.body.city.should.equal('kablah');
        res.body.state.should.be.a('string');
        res.body.state.should.equal('om');
        res.body.zipCode.should.be.a('string');
        res.body.zipCode.should.equal('23423');
        res.body.stateTax.should.be.a('number');
        res.body.stateTax.should.equal(6);
        res.body.recommendedTip.should.be.a('number');
        res.body.recommendedTip.should.equal(13);
        done();
      });
  });
  //test for put for /store
  it('should update the store data', function(done) {
    chai.request(app)
      //request to /store
      .get('/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
      .send({
        query: {
          $sort: { _id: 1 }
        }
      })
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /store
          .put('/stores/' + res.body.data[1]._id)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '.concat(token))
          //attach data to request
          .send({
            storeNumber: 529,
            storeName: 'somestore9',
            address: '329 drive rd',
            city: 'kablah4',
            state: 'om6',
            zipCode: '23421',
            stateTax: 9,
            recommendedTip: 12
          })
          //when finished do the following
          .end(function(err, res) {
            res.body.storeNumber.should.be.a('number');
            res.body.storeNumber.should.equal(529);
            res.body.storeName.should.be.a('string');
            res.body.storeName.should.equal('somestore9');
            res.body.address.should.be.a('string');
            res.body.address.should.equal('329 drive rd');
            res.body.city.should.be.a('string');
            res.body.city.should.equal('kablah4');
            res.body.state.should.be.a('string');
            res.body.state.should.equal('om6');
            res.body.zipCode.should.be.a('string');
            res.body.zipCode.should.equal('23421');
            res.body.stateTax.should.be.a('number');
            res.body.stateTax.should.equal(9);
            res.body.recommendedTip.should.be.a('number');
            res.body.recommendedTip.should.equal(12);
            done();
          });
      });
  });
  //test to delete /store
  it('should delete the store data', function(done) {
    chai.request(app)
      //request to /store
      .get('/stores')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
      .send({
        query: {
          $sort: { _id: 1 }
        }
      })
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /menuitem
          .delete('/stores/' + res.body.data[3]._id)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '.concat(token))
          //when finished do the following
          .end(function(err, res) {
            //check returned json against expected value
            res.body.storeName.should.be.a('string');
            res.body.storeName.should.equal('FOod r Us4');
            done();
          });
      });
  });
});
