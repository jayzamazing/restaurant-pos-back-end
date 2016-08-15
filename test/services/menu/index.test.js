/*jshint esversion: 6 */
'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../../../src/app');
var Menu = app.service('menus');
var User = app.service('users');
const service = require('feathers-mongoose');
var authentication = require('feathers-authentication/client');
const bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var token;
//config for app to do authentication
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(authentication());
//use http plugin
chai.use(chaiHttp);
//use should
var should = chai.should();
/*
 * All tests that should be run
 */
describe('menu service', () => {
  //setup
  before((done) => {
    //start the server
    this.server = app.listen(3030);
    //once listening do the following
    this.server.once('listening', () => {
      //create some mock menu items
      Menu.create({
        name: 'hamburger',
        price: 7.99,
        categories: ['lunch', 'burgers', 'dinner']
      });
      Menu.create({
        name: 'spinach omlete',
        price: 4.99,
        categories: ['breakfast', 'omlete']
      });
      Menu.create({
        name: 'steak',
        price: 12.99,
        categories: ['dinner', 'entree']
      });
      Menu.create({
        name: 'reuben',
        price: 6.99,
        categories: ['lunch', 'sandwhich']
      });
      Menu.create({
        name: 'soft drink',
        price: 1.99,
        categories: ['drinks', 'soda']
      });
      Menu.create({
        name: 'fries',
        price: 1.99,
        categories: ['lunch', 'side']
      });
      //create mock user
      User.create({
         'username': 'resposadmin',
         'password': 'igzSwi7*Creif4V$',
         'roles': ['admin']
      });
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
  //teardown after tests
  after((done) => {
    //delete contents of menu in mongodb
    Menu.remove({}, () => {
      User.remove({}, () => {
        //stop the server
        this.server.close(function() {});
        done();
      });
    });

  });
  it('registered the menus service', () => {
    assert.ok(app.service('menus'));
  });
  //test for /menu get request
  it('should get menu items', (done) => {
            //setup a request
            chai.request(app)
            //request to /menu
            .get('/menus')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer '.concat(token))
            //when finished do the following
            .end((err, res) => {
                if (err) {
                  console.error(err);
                }
                //ensure menu items have specific properties
                res.body.data.should.be.a('array');
                res.body.data[0].should.have.property('name');
                res.body.data[0].name.should.equal('hamburger');
                res.body.data[0].should.have.property('price');
                res.body.data[0].price.should.equal(7.99);
                res.body.data[0].categories.should.be.an('array')
                    .to.include.members(['lunch', 'burgers', 'dinner']);
                res.body.data[1].should.have.property('name');
                res.body.data[1].name.should.equal('spinach omlete');
                res.body.data[1].should.have.property('price');
                res.body.data[1].price.should.equal(4.99);
                res.body.data[1].categories.should.be.an('array')
                    .to.include.members(['breakfast', 'omlete']);
                done();
            });
  });
});