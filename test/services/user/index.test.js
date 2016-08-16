'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../../../src/app');
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
describe('user service', function() {
  //setup
  before((done) => {
    //start the server
    this.server = app.listen(3030);
    //once listening do the following
    this.server.once('listening', () => {
      //go through mongoose and create some mock items for testing
      //TODO create more mock users
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
    User.remove(null, () => {
      //stop the server
      this.server.close(function() {});
      done();
    });
  });
  it('registered the users service', () => {
    assert.ok(app.service('users'));
  });
});
